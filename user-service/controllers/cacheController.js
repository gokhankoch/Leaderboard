const redis = require('redis');
const { promisify } = require('util');
const AppError = require('../utils/appError');

const REDIS_LEADERBOARD = 'LEADERBOARD';

//const client = redis.createClient(process.env.REDISURL);
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const cache = func => {
  return promisify(client[func]).bind(client);
};

const calculateUserIndexChange = async userId => {
  try {
    const resultRange = await cache('ZRANGE')([
      `${userId}`,
      0,
      -1,
      'WITHSCORES'
    ]);

    if (resultRange.length > 0) {
      const getFirstIndex = resultRange[0].split('::')[0];

      // get current index
      const getLastIndex = await cache('ZREVRANK')([
        REDIS_LEADERBOARD,
        `${userId}`
      ]);

      return getFirstIndex - getLastIndex;
    }
  } catch (error) {
    return new AppError(error, 500);
  }

  return 0;
};

const recordUserCurrentIndex = async userId => {
  // get user index
  const index = await cache('ZREVRANK')([REDIS_LEADERBOARD, userId]);

  const timeStamp = Date.now();

  // add user index change
  return cache('ZADD')([userId, timeStamp, `${index}::${timeStamp}`]);
};

const addUser = async (userId, userName, DOB) => {
  // if not exist, user will be added

  try {
    await cache('ZINCRBY')([
      REDIS_LEADERBOARD,
      0,
      `${userId}:${userName}:${DOB}`
    ]);

    await recordUserCurrentIndex(`${userId}:${userName}:${DOB}`);
  } catch (error) {
    return new AppError(error, 500);
  }
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
      const row = {
        index: users[i],
        score: users[i + 1],
        // eslint-disable-next-line no-await-in-loop
        change: await calculateUserIndexChange(users[i])
      };
      rows.push(row);
    }

    return rows;
  } catch (error) {
    return new AppError(error, 500);
  }
};

const userInRank = async (userId, top, bottom) => {
  // get user index
  const index = await cache('ZREVRANK')([REDIS_LEADERBOARD, userId]);
  //console.log({ index });

  const bottomIndex = index - bottom < 0 ? 0 : index - bottom;
  const topIndex = index + top + 1;

  const users = await cache('ZREVRANGE')([
    REDIS_LEADERBOARD,
    bottomIndex,
    topIndex,
    'WITHSCORES'
  ]);
  // console.log(users);
  const rows = [];

  for (let i = 0; i < users.length; i += 2) {
    const row = {
      index: users[i],
      score: users[i + 1],
      // eslint-disable-next-line no-await-in-loop
      change: await calculateUserIndexChange(users[i])
    };
    rows.push(row);
  }
  return rows;
};

module.exports = {
  client,
  addUser,
  top100Users,
  userInRank
};
