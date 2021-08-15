const express = require('express');
const mongoose = require('mongoose');
const { taskReward } = require('./tasks/reward-distribution');
const { redisDailyClean } = require('./tasks/redis-daily-clean');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION: Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();

const port = process.env.PORT || 5001;
const DB =
  process.env.DATABASE ||
  'mongodb://mongo:27017' ||
  'mongodb://localhost:27017/leaderboard';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection succesfull!'));

// reward distributer
taskReward();
// Redis clean index . checks every hours
redisDailyClean();

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION: Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
