const db = require('./config/database');

// Get all buses
db.all("SELECT * FROM buses", [], (err, rows) => {
  if (err) return console.error(err);
  console.log("All buses:", rows);
});

// Get a bus by busNo
db.get("SELECT * FROM buses WHERE busNo = ?", ['পদ্মা'], (err, bus) => {
  if (err) return console.error(err);
  console.log("Bus পদ্মা:", bus);
});
