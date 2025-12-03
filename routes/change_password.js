const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/database");

// Use db helpers
const getAsync = db.getAsync;
const runAsync = db.runAsync;

router.put("/change-password", async (req, res) => {
    const { studentId, oldPassword, newPassword } = req.body;

    if (!studentId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await getAsync("SELECT * FROM users WHERE student_id = ?", [studentId]);

        console.log("Fetched user:", user);
        console.log("Old password input:", oldPassword);

        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(401).json({ message: "Old password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await runAsync("UPDATE users SET password = ? WHERE student_id = ?", [hashedPassword, studentId]);

        res.json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Error in change-password route:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
