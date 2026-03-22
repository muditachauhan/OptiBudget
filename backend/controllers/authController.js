const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: "User registered" });
        }
    );
};

// Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ msg: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Wrong password" });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

            res.json({ token });
        }
    );
};