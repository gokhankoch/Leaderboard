const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION: Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const server = http.createServer(app);
const { Server } = require('socket.io');
//const io = new Server(server);
app.io = new Server(server);
const cacheRoutes = require('./routes/cacheRoutes')(app.io);

app.use(cors());

app.use('/', cacheRoutes);

const port = process.env.PORT || 4001;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION: Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
