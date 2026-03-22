const db = require("../database/db");

// Add expense
exports.addExpense = (req, res) => {
    const { userId, title, amount, category } = req.body;

    db.run(
        "INSERT INTO expenses (userId, title, amount, category, date) VALUES (?, ?, ?, ?, datetime('now'))",
        [userId, title, amount, category],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: "Expense added" });
        }
    );
};

// Get expenses
exports.getExpenses = (req, res) => {
    const { userId } = req.params;

    db.all(
        "SELECT * FROM expenses WHERE userId = ?",
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json(rows);
        }
    );
};