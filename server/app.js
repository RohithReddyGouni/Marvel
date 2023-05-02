const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");

app.use(cors());

app.use(
  session({
    name: "AuthCookie",
    secret: "4kAQJRzpPSJ27pttoqejyh8RsjfMFEJXeGqBCL5p4ow4HkszhbXjux8kWWr9BYpC",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 600000 },
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

const configRoutes = require("./routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(4000, () => {
  console.log("Your routes will be running on http://localhost:4000");
});
