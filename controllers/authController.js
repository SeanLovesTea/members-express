const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

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
      res.render('signup', {errors: errors.array(), success:[]})
    }
    else if(uniqueEmail.length > 0) {
      res.render('signup', { errors: [{msg: 'email already taken '}], success: []})
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
        
        } catch(err){
          return next(err)
        } 
      })
  }
  res.redirect('/')
}]
exports.sign_out = async(req, res, next) => {
 req.logout(function(err){
  if (err) { return next(err)}
  return res.redirect('/')
 })
}

exports.login_check = async(req, res, next) => {
  console.log(req.user)
  if(req.user){
    next()
  } else {
    return res.redirect('/login')
  }
}

exports.secret_password = async(req, res, next) => {
  if (req.body.password !== 'Louiseypoo') {
     res.render('password',{ message: 'Incorrect password' })
  } else {
    console.log('correct password' + req.user)
    const user = await User.findOne({ email: req.user.email })
    user.member = true
    await user.save()
    console.log('status updated!')
  }
  res.redirect('/')
}