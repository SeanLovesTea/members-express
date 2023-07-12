const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => res.render('home',{user: req.user}))
router.get('/home', (req, res) => res.render('home', {user: req.user}))
router.get("/login", (req, res) => res.render("login",{messages : req.flash()} ));
router.post('/logout', authController.sign_out) 

router.get("/signup",  (req, res) => res.render("signup", {errors:[], success:[]}));

router.post('/sign-up', authController.sign_up_post)

passport.use(
  new LocalStrategy({usernameField: 'email'}, async(email, password, done) => {
    console.log(email)
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      };
      bcrypt.compare(password, user.password, function(err, res) {
        if(err){
          return done(null, false, { message: "Incorrect password" })
        }
        if (res){
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" })
        }
      })
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id)
})
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch(err) {
    done(err)
  }
})
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
    failureMessage: true,
  })
);
router.get('/password', authController.secret_password_login_check, (req, res) => res.render("password"))
router.post('/password', authController.secret_password)

module.exports = router;