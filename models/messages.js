const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  message: { type: String, reqruired: true, maxLength: 200 },
  createdBy: { type: String },
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', MessageSchema)
