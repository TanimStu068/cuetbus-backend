# CUETBus Backend

This is the **CUETBus backend server**, built with **Node.js** and **Express**, using **SQLite** as the database. It handles all the server-side logic for the CUETBus Flutter app, including user authentication, bus booking, notifications, digital passes, and more.

---

## 🛠 Features

- **User Authentication & Management**
  - Create Account (Sign Up)
  - Login
  - Forgot Password
  - Change Password
  - Delete Account
  - Profile Management

- **Bus Booking & Management**
  - Seat Selection
  - Booking Confirmation
  - Booking Details
  - Digital Pass Generation
  - Bus List & Bus Schedule
  - Bus Details

- **Notifications**
  - Real-time Push Notifications for booking and schedule updates

- **Other Features**
  - Help & Support endpoints
  - Lost and Found management
  - Safety Tips retrieval
  - Service Updates retrieval
  - Settings management (Dark/Light Mode preference)
  - Terms and Privacy Policy endpoints

---

## 💾 Database

- **SQLite** is used as the database.
- All tables are automatically created on server start if they do not exist.
- Tables include:
  - `users`
  - `bookings`
  - `buses`
  - `notifications`
  - `lost_and_found`
  - `service_updates`
  - Other related tables for app features

---

## 🛠 Installation

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/cuetbus_backend.git
