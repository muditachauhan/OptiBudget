const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
    const { userId, title, amount, category } = req.body;

    const expense = new Expense({
        userId,
        title,
        amount,
        category
    });

    await expense.save();
    res.json(expense);
};

// Get expenses
exports.getExpenses = async (req, res) => {
    const expenses = await Expense.find({ userId: req.params.userId });
    res.json(expenses);
};