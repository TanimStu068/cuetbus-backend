const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create or open database file
const db = new sqlite3.Database(
  path.join(__dirname, "cuetbus.db"),
  (err) => {
    if (err) console.error("Database connection error:", err);
    else console.log("Database connected at:", path.join(__dirname, "cuetbus.db"));
  }
);

// Return a single row
db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Return multiple rows
db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Run INSERT / UPDATE / DELETE
db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};


// Create users table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  student_id TEXT,
  email TEXT UNIQUE,
  password TEXT
)
`, (err) => {
    if (err) console.error("Table creation error:", err);
    else console.log("Users table ready");
});


// Create password reset table
db.run(`
CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  otp TEXT,
  expires_at INTEGER
)`);

// Create buses table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS buses (
  busNo TEXT PRIMARY KEY,
  route TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  morning_start TEXT,
  morning_return TEXT,
  noon_start TEXT,
  noon_route TEXT,
  evening_start TEXT,
  evening_return TEXT
)`, (err) => {
    if (err) console.error("Buses table creation error:", err);
    else console.log("Buses table ready");
});

db.run(`
  CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  busNo TEXT,
  day_type TEXT,      -- 'weekday' or 'weekend'
  time TEXT,
  route TEXT,
  type TEXT,          -- Morning / Noon / Evening
  FOREIGN KEY (busNo) REFERENCES buses(busNo)
)`, (err) => {
  if (err) console.error("Buse Schedule table creation error:", err);
  else console.log("Buse Schedule table ready");
});



module.exports = db;