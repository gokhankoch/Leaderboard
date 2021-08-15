const catchAsync = require('./../utils/catchAsync');
const { addUser } = require('./cacheController');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // create in db
    const doc = await Model.create(req.body);

    // create cache user
    //TODO://temporary solution
    await addUser(doc._id, doc.name, doc.dob);

    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

// quick solution. best practise not followed.
exports.getAll = async Model => Model.find();
