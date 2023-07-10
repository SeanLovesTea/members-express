const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  email: {
    email: { type: String,required: true,unique: true,validate: {validator: function(v) {return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(v)}}}
  },
  date_of_birth: { type: Date },
  password: { type: String, required: true },
  status: { type: String, required: true }
});

// Virtual for author's full name
UserSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// Virtual for author's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);