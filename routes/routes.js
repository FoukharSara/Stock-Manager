const express = require("express");
const router = express.Router();
const authenticateToken = require("../routes/loggedin");

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/edit_user", authenticateToken, (req, res) => {
  res.render("edit_user");
});

module.exports = router;
