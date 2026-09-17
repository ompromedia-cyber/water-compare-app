const express = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware для проверки админа
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Получить все воды
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM waters ORDER BY popular DESC, brand_name ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Получить одну воду
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM waters WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Добавить воду (только админ)
router.post('/', requireAuth, async (req, res) => {
  try {
    const w = req.body;
    const sql = `
      INSERT INTO waters 
      (id, brand_name, country_code, flag_emoji, \`group\`, category, ph, tds_mg_l, ca_mg_l, mg_mg_l, na_mg_l, k_mg_l, cl_mg_l, sparkling, source_type, confidence_level, notes, popular)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      w.id, w.brand_name, w.country_code, w.flag_emoji, w.group, w.category,
      w.ph, w.tds_mg_l, w.ca_mg_l, w.mg_mg_l, w.na_mg_l, w.k_mg_l, w.cl_mg_l,
      w.sparkling, w.source_type || 'admin', w.confidence_level, w.notes, w.popular || false
    ]);
    res.json({ success: true, id: w.id });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Water with this ID already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

// Обновить воду (только админ)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const w = req.body;
    const sql = `
      UPDATE waters SET 
      brand_name = ?, country_code = ?, flag_emoji = ?, \`group\` = ?, category = ?,
      ph = ?, tds_mg_l = ?, ca_mg_l = ?, mg_mg_l = ?, na_mg_l = ?, k_mg_l = ?, cl_mg_l = ?,
      sparkling = ?, confidence_level = ?, notes = ?, popular = ?
      WHERE id = ?
    `;
    const result = await pool.query(sql, [
      w.brand_name, w.country_code, w.flag_emoji, w.group, w.category,
      w.ph, w.tds_mg_l, w.ca_mg_l, w.mg_mg_l, w.na_mg_l, w.k_mg_l, w.cl_mg_l,
      w.sparkling, w.confidence_level, w.notes, w.popular || false,
      req.params.id
    ]);
    if (result[0].affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Удалить воду (только админ)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM waters WHERE id = ?', [req.params.id]);
    if (result[0].affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Массовый импорт (только админ)
router.post('/import', requireAuth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const waters = req.body.waters || [];
    
    for (const w of waters) {
      await connection.query(`
        INSERT INTO waters 
        (id, brand_name, country_code, flag_emoji, \`group\`, category, ph, tds_mg_l, ca_mg_l, mg_mg_l, na_mg_l, k_mg_l, cl_mg_l, sparkling, source_type, confidence_level, notes, popular)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        brand_name = VALUES(brand_name),
        ph = VALUES(ph),
        tds_mg_l = VALUES(tds_mg_l),
        updated_at = CURRENT_TIMESTAMP
      `, [
        w.id, w.brand_name, w.country_code, w.flag_emoji, w.group, w.category,
        w.ph, w.tds_mg_l, w.ca_mg_l, w.mg_mg_l, w.na_mg_l, w.k_mg_l, w.cl_mg_l,
        w.sparkling, w.source_type || 'admin', w.confidence_level, w.notes, w.popular || false
      ]);
    }
    
    await connection.commit();
    res.json({ success: true, count: waters.length });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Import failed' });
  } finally {
    connection.release();
  }
});

module.exports = router;
