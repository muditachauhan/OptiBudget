const db = require("../database/db");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) return res.status(400).json({ error: "User exists" });

      res.json({ message: "User registered successfully" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, user) => {
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, "secretkey123");

      // 🔥 IMPORTANT CHANGE
      res.json({
        token: token,
        userId: user.id,
        email: user.email
      });
    }
  );
};