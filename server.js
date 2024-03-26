const express = require("express");
const app = express();
const db = require("./models");
const path = require("path");
const public = path.join(__dirname, "./public");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const clientRoutes = require("./routes/client-routes");
const productRoutes = require("./routes/product-routes");
const producttype = require("./routes/producttype-routes");
const userRoutes = require("./routes/user-routes");
dotenv.config();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.json());
app.use(cookieParser());
//views
app.set("view engine", "ejs");
app.use(express.static(public));

//routes
app.use("/", require("./routes/routes"));
app.use("/", require("./routes/auth"));
app.use(express.static(__dirname + "/public"));
app.use("/", clientRoutes);
app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", producttype);

//check if the username exists
db.User.count({ where: { username: "admin" } }).then((doc) => {
  if (doc === 0) {
    bcrypt.hash(process.env.PASSWORD, 10).then((hashedPassword) => {
      db.User.create({
        firstname: "Adil",
        lastname: "El Msiyeh",
        username: "admin",
        email: "adil@gmail.com",
        password: hashedPassword,
      });
    });
  }
});

//logout
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

db.sequelize.sync().then(() => {
  app.listen(5000, () => console.log("its working"));
});
