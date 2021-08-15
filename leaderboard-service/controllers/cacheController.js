const redis = require('redis');
const { promisify } = require('util');

const LEADERBOARD_REWARDS = 'LEADERBOARD_REWARDS';
const LEADERBOARD_REWARDS_WEEKLY = 'LEADERBOARD_REWARDS_WEEKLY';
const REDIS_LEADERBOARD = 'LEADERBOARD';

//const client = redis.createClient(process.env.REDISURL);
const client = redis.createClient({ host:  process.env.REDIS_HOST,
   port: process.env.REDIS_PORT});

const cache = func => {
  return promisify(client[func]).bind(client);
};

const recordUserCurrentIndex = async userId => {
  // get user index
  const index = await cache('ZREVRANK')([REDIS_LEADERBOARD, userId]);
  console.log('index : ', index);

  const timeStamp = Date.now();

  // add user index change
  return cache('ZADD')([userId, timeStamp, `${index}::${timeStamp}`]);
};

const addScore = async query => {
  // record user index.  this recorded will be deleted by schedule-task-service daily bases.
  await recordUserCurrentIndex(query.userId);
  // update user score
  await cache('ZINCRBY')([REDIS_LEADERBOARD, query.data, query.userId]);
  // add to total rewards
  await cache('ZINCRBY')([
    LEADERBOARD_REWARDS,
    query.data,
    LEADERBOARD_REWARDS_WEEKLY
  ]);
};

module.exports = {
  client,
  addScore
};
