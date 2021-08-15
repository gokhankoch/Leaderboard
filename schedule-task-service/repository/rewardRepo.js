const Reward = require('./../models/rewardModel');

const createUserRewards = async (userid, rewards) => {
  await Reward.create({ userid, rewards });
};

module.exports = {
  createUserRewards
};
