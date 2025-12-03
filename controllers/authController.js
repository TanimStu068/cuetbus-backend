const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey123"; // change this for production

// Signup handler
exports.signup = (req, res) => {
  console.log("Signup request received:", req.body);
  const { name, student_id, email, password } = req.body;

  if (!name || !student_id || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /^u\d+@student\.cuet\.ac\.bd$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email must be in the format u<id>@student.cuet.ac.bd" });
  }

  // Check if email already exists
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      console.error("Database SELECT error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (row) return res.status(400).json({ error: "Email already exists!" });

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Bcrypt error:", err);
        return res.status(500).json({ error: "Error hashing password" });
      }

      db.run(
        `INSERT INTO users (name, student_id, email, password) VALUES (?, ?, ?, ?)`,
        [name, student_id, email, hash],
        function (err) {
          if (err) {
            console.error("Database INSERT error:", err);
            return res.status(500).json({ error: "Database insert error" });
          }
          console.log("New user ID:", this.lastID);
          res.json({ message: "Account created successfully!" });
        }
      );
    });
  });
};

// Login handler
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: "Error checking password" });
      if (!match) return res.status(401).json({ error: "Wrong password" });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "Login successful", token });
    });
  });
};
