const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require("luxon")

const MessageSchema = new Schema({
  message: { type: String, reqruired: true, maxLength: 200 },
  createdBy: { type: String },
  timestamp: { type: Date, default: Date.now }
})
MessageSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.Date_MED)
})
module.exports = mongoose.model('Message', MessageSchema)
