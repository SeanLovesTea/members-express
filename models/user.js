const mongoose = require("mongoose");
const validator = require('validator')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: [true, 'Email address is required'] },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);