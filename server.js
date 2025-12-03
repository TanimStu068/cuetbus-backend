
const express = require("express");
const cors = require("cors");
const db = require("./config/database"); 

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const userRoutes = require('./routes/user');
const busesRoutes = require('./routes/buses');
const changePasswordRoutes = require("./routes/change_password");
const deleteAccountRoute = require("./routes/delete_account");

app.use("/auth", authRoutes);
app.use("/password", passwordRoutes);
app.use('/user', userRoutes); 
app.use('/buses', busesRoutes);
app.use("/auth/change-password", changePasswordRoutes);
app.use("/auth/delete-account", deleteAccountRoute);

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) console.error(err);
  else console.log("Tables in DB:", rows);
});

db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) console.error(err);
  else console.log("Users in DB:", rows);
});

// --- Your API routes here ---
app.get("/schedules", (req, res) => {
  db.all("SELECT * FROM schedules", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/schedules/:busNo", (req, res) => {
  const { busNo } = req.params;
  db.all("SELECT * FROM schedules WHERE busNo = ?", [busNo], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


const JWT_SECRET = "mysecretkey123"; 

// Simple GET route to test server
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
