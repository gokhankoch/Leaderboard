const cron = require('node-cron');
const {
  getTotalRewards,
  top100Users,
  flushAll
} = require('../controllers/cacheController');

const { createUserRewards } = require('../repository/rewardRepo');

const taskReward = () => {
  // task to run weekly. (Sunday at midnight)
  cron.schedule('0 0 * * 0', async () => {
    //get totals
    const totalRewards = await getTotalRewards();
    const shareRewardsTotal = totalRewards * 0.2;

    // get top 100
    const top100 = await top100Users();

    let reward = 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < top100.length; i++) {
      switch (i) {
        case 0:
          reward = shareRewardsTotal * 0.2;
          break;
        case 1:
          reward = shareRewardsTotal * 0.15;
          break;
        case 2:
          reward = shareRewardsTotal * 0.1;
          break;
        default:
          reward = shareRewardsTotal * (0.55 / 97);
      }

      // insert to DB
      // eslint-disable-next-line no-await-in-loop
      await createUserRewards(top100[i], reward);
    }

    //clear redis
    await flushAll();
  });
};

module.exports = {
  taskReward
};
