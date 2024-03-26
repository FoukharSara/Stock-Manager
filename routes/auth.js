var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const authenticateToken = require("../routes/loggedin");

// Use body parser middleware to parse incoming requests
dotenv.config();

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    // sets an HTTP cookie named "token" with the value of the token and the user connot access this cookie
    res.cookie("token", token, { httpOnly: true });

    // Redirect the client to the "welcome" page
    res.redirect("/welcome");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
