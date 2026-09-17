const express = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE login = ? AND password_hash = SHA2(?, 256)',
      [login, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { login, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
