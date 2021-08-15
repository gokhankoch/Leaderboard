const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const { top100Users, userInRank, addUser } = require('./cacheController');

exports.createUser = factory.createOne(User);

const insertCache = async doc => {
  await addUser(doc._id, doc.name, doc.dob);
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let top100 = await top100Users();

  // this part added for demo.
  if (top100.length < 1) {
    // redis cleaned by schedule-task-service. get all user from db.
    const docs = await factory.getAll(User);

    docs.map(doc => insertCache(doc));

    top100 = await top100Users();
  }
  let userRank = [];

  if (req.params.id) {
    // hard-coded temprorarily. wen can get them as request params
    const top = 2;
    const bottom = 3;
    userRank = await userInRank(req.params.id, top, bottom);
  }

  res.status(200).json({
    status: 'success',
    data: {
      top100,
      userRank
    }
  });
});
