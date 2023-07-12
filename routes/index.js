const express = require('express');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messagesController');
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/', messageController.messages_list)
router.get("/login", (req, res) => res.render("login",{messages : req.flash(),user: req.user} ));
router.post('/logout', authController.sign_out) 
router.get("/signup",authController.login_check,  (req, res) => res.render("signup", {errors:[], success:[],user: req.user}));
router.post('/signup', authController.sign_up_post)
router.get('/new',authController.login_check, (req, res) => res.render("createMessage", { user: req.user}))
router.post('/new', messageController.new_message)

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
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get('/password', authController.login_check, (req, res) => res.render("password", {message: '', user: req.user}))
router.post('/password', authController.secret_password)

module.exports = router;