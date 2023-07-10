const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const User = require('./models/user');
const { body, validationResult } = require('express-validator')

require('dotenv').config()

const mongoDb = process.env.MONGODB_KEY ;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.set("/views", __dirname);
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.get("/", (req, res) => res.render("index"));

app.get("/sign-up",  (req, res) => res.render("sign-up", {errors:[], success:[]}));

const sign_up_post = [
  body('firstName').trim().isLength({ min:1 }).escape().withMessage('First Name required'),
  body('lastName').trim().isLength({ min:1 }).escape().withMessage('Last Name required'),
  body('email').trim().isEmail().isLength({ min:1 }).escape().withMessage('Valid Email required'),
  
  async (req, res, next) => {
    const uniqueEmail = await User.find({ email: req.body.email })
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      res.render('sign-up', {errors: errors.array(), success:[]})
    }
    else if(uniqueEmail.length > 0) {
      res.render('sign-up', { errors: [{msg: 'email already taken '}], success: []})
    }else{
      bcrypt.hash(req.body.password, 10, async function(err, hash) {
        if (err) return next(err)
        try {
          const user = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: hash,
            member_status: 'Member'
        })
        const result = await user.save()
        res.redirect('/')
        } catch(err){
          return next(err)
        } 
      })
  }
}]
app.post('/sign-up', sign_up_post)


app.listen(8080, () => console.log("app listening on port 8080!"));