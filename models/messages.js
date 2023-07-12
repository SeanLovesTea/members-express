const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  message: { type: String, reqruired: true, maxLength: 200 },
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
})

modules.exports = mongoose.model('Message', MessageSchema)
