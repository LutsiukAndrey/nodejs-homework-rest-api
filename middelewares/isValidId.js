const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { id } = req.user;

  if (!isValidObjectId(id)) {
    next(HttpError(404, `${id}  Invalid id`));
  }
  next();
};

module.exports = isValidId;
