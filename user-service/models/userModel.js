const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  dob: {
    type: String,
    required: [true, 'Please tell us your date of birthday!']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
