const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey123";


// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // user object contains at least id or email
    next();
  });
}



// GET /user/me
router.get("/me", authenticateToken, (req, res) => {
  const id = req.user.id; // we store email in JWT

  const query = `SELECT name, student_id, email FROM users WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!row) return res.status(404).json({ error: "User not found" });

    res.json(row); // { name, student_id, email }
  });
});

module.exports = router;
