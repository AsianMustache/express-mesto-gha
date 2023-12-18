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
    // Формирование сообщения об ошибке
    const errorMessage = error.details
      .map((detail) => {
        return `${detail.message}`;
      })
      .join(", ");

    // Отправка ответа с ошибкой
    res.status(400).json({
      message: "Ошибка валидации: " + errorMessage,
    });
  } else {
    next();
  }
};

module.exports = validate;
