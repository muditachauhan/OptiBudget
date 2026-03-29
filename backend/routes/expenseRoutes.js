const express = require("express");
const router = express.Router();

const { addExpense, getExpenses } = require("../controllers/expenseController");

router.post("/", addExpense);
router.get("/:userId", getExpenses);

// 🔥 ADD HERE
router.delete("/reset/:userId", (req, res) => {
  const { userId } = req.params;

  const db = require("../database/db");

  db.run("DELETE FROM expenses WHERE userId = ?", [userId], function(err){
    if(err){
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "All expenses deleted" });
  });
});

module.exports = router;