// const http2 = require("http2");

// const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);
//   if (error) {
//     res
//       .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
//       .json({ message: error.details[0].message });
//   } else {
//     next();
//   }
// };
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    next(validationError);
  } else {
    next();
  }
};

module.exports = validate;
