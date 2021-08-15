const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, 'Please tell us userid!']
  },
  rewards: {
    type: Number,
    required: [true, 'Please tell us rewards!']
  },
  timestamp: { type: Date, default: Date.now }
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
