const db = require("../config/database");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Helper: generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (Here just for testing, you can later integrate email service)
const sendOTPEmail = (email, otp) => {
  console.log(`Sending OTP ${otp} to ${email}`);
};

exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  // Check if user exists
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 mins

    // Store OTP in password_resets table
    db.run(
      `INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?)`,
      [email, otp, expiresAt],
      function (err) {
        if (err) return res.status(500).json({ error: "Database error" });

        sendOTPEmail(email, otp);
        res.json({ message: "OTP sent to your email" });
      }
    );
  });
};

exports.verifyOTPAndResetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ error: "All fields are required" });

  // Check OTP
  db.get(
    `SELECT * FROM password_resets WHERE email = ? AND otp = ?`,
    [email, otp],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!row) return res.status(400).json({ error: "Invalid OTP" });
      if (Date.now() > row.expires_at)
        return res.status(400).json({ error: "OTP expired" });

      // Hash new password
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        // Update password in users table
        db.run(
          `UPDATE users SET password = ? WHERE email = ?`,
          [hash, email],
          function (err) {
            if (err) return res.status(500).json({ error: "Database error" });

            // Delete used OTP
            db.run(`DELETE FROM password_resets WHERE email = ?`, [email]);

            res.json({ message: "Password reset successfully!" });
          }
        );
      });
    }
  );
};
