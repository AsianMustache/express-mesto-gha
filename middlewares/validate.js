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
// const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);
//   if (error) {
//     const validationError = new Error(error.details[0].message);
//     validationError.statusCode = 400;
//     next(validationError);
//   } else {
//     next();
//   }
// };

//

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // Сбор всех сообщений об ошибках от Joi
    const errors = error.details.map((err) => {
      return {
        field: err.path.join("."),
        message: err.message.replace(/["']/g, ""),
      };
    });

    // Отправка кастомного сообщения об ошибке
    res.status(400).json({
      message: "Ошибка валидации поймана при помощи Joi",
      errors: errors,
    });
  } else {
    next();
  }
};

module.exports = validate;

module.exports = validate;
