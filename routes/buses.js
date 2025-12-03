const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', (req, res) => {
  db.all("SELECT * FROM buses", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:busNo', (req, res) => {
  const { busNo } = req.params;
  db.get("SELECT * FROM buses WHERE busNo = ?", [busNo], (err, bus) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(bus);
  });
});

module.exports = router;
