// const http2 = require("http2");
const { BadRequestError } = require("./errors");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // res
    //   .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
    //   .json({ message: error.details[0].message });
    return next(new BadRequestError(error.details[0].message));
  }
  next();
};

module.exports = validate;
