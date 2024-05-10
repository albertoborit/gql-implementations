// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  roleId: String,
});

module.exports = mongoose.model('User', userSchema);
