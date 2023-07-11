const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => res.redirect('/log-in'))
router.get("/log-in", (req, res) => res.render("log-in",{messages : req.flash()} ));

router.get("/sign-up",  (req, res) => res.render("sign-up", {errors:[], success:[]}));

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
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/password",
    failureRedirect: "/",
    failureFlash: true,
    failureMessage: true,
  })
);
router.get('/password',(req, res) => res.render("password"))
router.post('/password', authController.secret_password)

module.exports = router;