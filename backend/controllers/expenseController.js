const db = require("../database/db");

exports.addExpense = (req, res) => {
  const { userId, title, amount, category } = req.body;

  db.run(
    "INSERT INTO expenses (userId, title, amount, category, date) VALUES  (?, ?, ?, ?, ?)",
    [userId, title, amount, category, new Date().toISOString()],
    function(err){
      if(err){
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Expense added successfully" });
    }
  );
};

exports.getExpenses = (req, res) => {
  const userId = req.params.userId;

  db.all(
    "SELECT * FROM expenses WHERE userId = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json(rows);
    }
  );
};