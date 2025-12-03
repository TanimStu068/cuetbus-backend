const path = require('path');

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = require('./config/database');
const buses = JSON.parse(fs.readFileSync('buses.json'));

buses.forEach(bus => {
  db.run(
    `INSERT OR IGNORE INTO buses 
    (busNo, route, capacity, amenities, driver_name, driver_phone, morning_start, morning_return, noon_start, noon_route, evening_start, evening_return)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bus.busNo,
      bus.route,
      bus.capacity,
      JSON.stringify(bus.amenities),
      bus.driver_name,
      bus.driver_phone,
      bus.trips.morning_start,
      bus.trips.morning_return,
      bus.trips.noon_start,
      bus.trips.noon_route,
      bus.trips.evening_start,
      bus.trips.evening_return
    ],
    (err) => {
      if (err) console.error("Insert error:", err, bus.busNo);
    }
  );
});
