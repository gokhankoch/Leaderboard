/* eslint-disable no-plusplus */
const redis = require('redis');
const { promisify } = require('util');
const AppError = require('./../utils/appError');

const LEADERBOARD_REWARDS = 'LEADERBOARD_REWARDS';
const LEADERBOARD_REWARDS_WEEKLY = 'LEADERBOARD_REWARDS_WEEKLY';
const REDIS_LEADERBOARD = 'LEADERBOARD';

//const client = redis.createClient(process.env.REDISURL);
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const cache = func => {
  return promisify(client[func]).bind(client);
};

const flushAll = async () => {
  client.flushdb(function(err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
};

const getTotalRewards = async () => {
  // if not exist, user will be added
  const totalRewards = await cache('ZSCORE')([
    LEADERBOARD_REWARDS,
    LEADERBOARD_REWARDS_WEEKLY
  ]);

  return totalRewards;
};

const top100Users = async () => {
  try {
    const users = await cache('ZREVRANGE')([
      REDIS_LEADERBOARD,
      0,
      99,
      'WITHSCORES'
    ]);
    const rows = [];
    for (let i = 0; i < users.length; i += 2) {
      rows.push(users[i].split(':')[0]);
    }
    return rows;
  } catch (error) {
    return new AppError(error, 500);
  }
};

// TODO: FIX the bug: there is huge assumption in this approach
const dailyClean = async () => {
  // get number of item in sets
  const total = await cache('ZCOUNT')([REDIS_LEADERBOARD]);

  const index = 0;

  // eslint-disable-next-line no-const-assign
  while (index++ < total) {
    // eslint-disable-next-line no-await-in-loop
    const users = await cache('ZREVRANGE')([
      REDIS_LEADERBOARD,
      index,
      index + 1
    ]);

    const timeStamp = Date.now();
    // eslint-disable-next-line no-await-in-loop
    await cache('ZREMRANGEBYSCORE')([
      users[0],
      '-inf',
      timeStamp - 24 * 60 * 60 * 1000 // equal to 24 hours
    ]);
  }
};

module.exports = {
  client,
  getTotalRewards,
  top100Users,
  flushAll,
  dailyClean
};
