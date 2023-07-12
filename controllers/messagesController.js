const User = require('../models/user')
const Message = require('../models/messages')

exports.messages_list = async (req, res, next) => {
  const allMessages = await Message.find().populate('createdBy').sort({timestamp: -1}).exec()
  
  res.render('home', {messages: allMessages,user: req.user})
  return next()
}
exports.new_message = async (req, res, next) => {
  const user = await User.findOne({ 'username': req.user.username })
  console.log(user)
  try {
    const message = new Message({
      message: req.body.message,
      createdBy: user.username,
      timestamp: Date.now()
    })
    const result = await message.save()
    
  } catch(err) {
    return next(err)
  }
  res.redirect('/')
}