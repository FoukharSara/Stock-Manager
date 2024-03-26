const jwt = require("jsonwebtoken");
const express = require("express");
const db = require("../models"); // Assuming your Sequelize models are defined in this file

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Fetch user information from the database using the decoded user ID
    const user = await db.User.findByPk(decoded.userId);
    if (!user) {
      return res.redirect("/login"); // User not found
    }
    // to store user information in the request context for the duration of the request
    req.user = user; 
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    // Redirect the user to the login page if the token is invalid
    return res.redirect("/login");
  }
};

module.exports = authenticateToken;
