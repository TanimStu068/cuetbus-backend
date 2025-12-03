const express = require("express");
const router = express.Router();
const db = require("../config/database");

const runAsync = db.runAsync;

router.delete("/delete-account", async (req, res) => {
    const { studentId } = req.body;

    if (!studentId) return res.status(400).json({ message: "studentId is required" });

    try {
        const result = await runAsync("DELETE FROM users WHERE student_id = ?", [studentId]);

        if (result.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Delete account error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
