const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const flash = require('connect-flash')

require('dotenv').config()

const mongoDb = process.env.MONGODB_KEY ;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const indexRouter  = require('./routes/index')

const app = express();
app.set("/views", __dirname);
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})
app.use('/public', express.static('public'))

app.use('/', indexRouter)

app.listen(8080, () => console.log("app listening on port 8080!"));