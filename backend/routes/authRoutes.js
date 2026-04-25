const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const { addExpense } = require("../controllers/expenseController");

router.post("/", verifyToken, addExpense);

module.exports = router;