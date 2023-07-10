const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, reqruired: true },
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
})

modules.exports = mongoose.model('Message', MessageSchema)
