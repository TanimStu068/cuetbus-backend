// const db = require('./config/database'); // your existing database connection
// const scheduleData = require("./bus_schedule.json");

// // Insert schedules safely
// scheduleData.forEach(bus => {
//   bus.weekday_schedule.forEach(sch => {
//     db.run(
//       `INSERT INTO schedules (busNo, day_type, time, route, type) VALUES (?, ?, ?, ?, ?)`,
//       [bus.busNo, "weekday", sch.time, sch.route, sch.type],
//       err => { if (err) console.error("Insert error:", err); }
//     );
//   });

//   bus.weekend_schedule.forEach(sch => {
//     db.run(
//       `INSERT INTO schedules (busNo, day_type, time, route, type) VALUES (?, ?, ?, ?, ?)`,
//       [bus.busNo, "weekend", sch.time, sch.route, sch.type],
//       err => { if (err) console.error("Insert error:", err); }
//     );
//   });
// });

// console.log("All schedules inserted successfully!");

const db = require('./config/database'); // existing database connection
const scheduleData = require("./bus_schedule.json");

// Clear the schedules table first to avoid duplicates
db.run(`DELETE FROM schedules`, (err) => {
  if (err) console.error("Error clearing schedules table:", err);
  else {
    console.log("Schedules table cleared");

    // Now insert schedules safely
    scheduleData.forEach(bus => {
      bus.weekday_schedule.forEach(sch => {
        db.run(
          `INSERT INTO schedules (busNo, day_type, time, route, type) VALUES (?, ?, ?, ?, ?)`,
          [bus.busNo, "weekday", sch.time, sch.route, sch.type],
          err => { if (err) console.error("Insert error:", err); }
        );
      });

      bus.weekend_schedule.forEach(sch => {
        db.run(
          `INSERT INTO schedules (busNo, day_type, time, route, type) VALUES (?, ?, ?, ?, ?)`,
          [bus.busNo, "weekend", sch.time, sch.route, sch.type],
          err => { if (err) console.error("Insert error:", err); }
        );
      });
    });

    console.log("All schedules inserted successfully!");
  }
});
