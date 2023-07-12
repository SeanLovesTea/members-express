const User = require('../models/user')
const Message = require('../models/messages')

exports.messages_list = async (req, res, next) => {
  const allMessages = await Message.find().exec()
  
  res.render('home', {messages: allMessages, user: req.user})
  return next()
}
exports.new_message = async (req, res, next) => {
  try {
    const message = new Message({
      message: req.body.message,
      user: req.user.username,
      timestamp: Date.now()
    })
    const result = await message.save()
    res.redirect('/')
  } catch(err) {
    return next(err)
  }
}