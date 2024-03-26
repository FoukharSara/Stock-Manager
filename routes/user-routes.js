const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("./loggedin");
const bcrypt = require("bcrypt");

//edit user infos
router.post("/account/:id", authenticateToken, async (req, res) => {
  await db.User.update(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((data) => {
      res.redirect("/account/" + req.params.id);
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/account", authenticateToken, (req, res) => {
  db.User.findOne()
    .then((response) => res.render("edit_user", { account: response }))
    .catch((err) => res.status(400).send(err));
});

router.post("/change_password/:id", async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Check if the new password and the confirmation password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({
          message: "New password and confirmation password do not match",
        });
    }

    const user = await db.User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.User.update({ password: hashedPassword }, { where: { id } });

    res.redirect("/account");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/auth/account", authenticateToken, (req, res) => {
  db.User.findOne()
    .then((response) => res.render("account", { account: response }))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
