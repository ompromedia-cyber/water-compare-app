const express = require('express');
const cors = require('cors');
require('dotenv').config();

const watersRouter = require('./routes/waters');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors({
  origin: ['https://ompromedia-cyber-water-compare-app-4fdf.twc1.net', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/waters', watersRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Water Expert API запущен на порту ${PORT}`);
});
