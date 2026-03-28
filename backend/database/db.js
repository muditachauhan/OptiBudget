// backend/database/db.js

const sqlite3 = require("sqlite3").verbose();

// Create DB file
const db = new sqlite3.Database("./database/optiBudget.db", (err) => {
    if (err) {
        console.error("❌ DB Error:", err.message);
    } else {
        console.log("✅ SQLite Connected");
    }
});

// Create tables
db.serialize(() => {

    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    // Expenses table
    db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            title TEXT,
            amount REAL,
            category TEXT,
            date TEXT
        )
    `);
});

module.exports = db;