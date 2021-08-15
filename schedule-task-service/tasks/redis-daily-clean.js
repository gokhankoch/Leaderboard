const cron = require('node-cron');
const { dailyClean } = require('../controllers/cacheController');

const redisDailyClean = () => {
  // task to run hourly.
  cron.schedule('* 1 * * *', async () => {
    // delete daily index from previous day.( sliding windows)
    await dailyClean();
  });
};

module.exports = {
  redisDailyClean
};
