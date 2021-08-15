const express = require('express');

const router = express.Router();

const { addScore } = require('../controllers/cacheController');

module.exports = function(io) {
  //Socket.IO
  io.on('connection', socket => {
    //ON Events
    socket.on('leaderboard', message => {
      console.log(message);
      addScore(message);
    });
    //End ON Events
  });
  return router;
};
