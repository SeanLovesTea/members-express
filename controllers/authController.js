const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

exports.sign_up_post = [
  body('username').trim().isLength({ min:1 }).escape().withMessage('Username required'),
  body('email').trim().isEmail().isLength({ min:1 }).escape().withMessage('Valid Email required'),
  body('password').isLength({ min: 5}),
  body('passwordConfirmation').custom((value, { req }) => {
    return value === req.body.password
  }).withMessage('Passwords do not match'),
  
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
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })
        const result = await user.save()
        res.redirect('/')
        } catch(err){
          return next(err)
        } 
      })
  }
}]
exports.secret_password = async(req, res, next) => {
  if (req.body.password !== 'Louiseypoo') {
    return { message: 'Incorrect Password!'}
  } else {
    console.log('correct password' + req.user)
    const user = await User.findOne({ email: req.user.email })
    user.member = true
    await user.save()
    console.log('status updated!')
    res.redirect('/')
  }
}