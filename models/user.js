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

// Virtual for author's full name
// UserSchema.virtual("name").get(function () {
//   return this.last_name + ", " + this.first_name;
// });

// // Virtual for author's URL
// UserSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/user/${this._id}`;
// });

// Export model
module.exports = mongoose.model("User", UserSchema);