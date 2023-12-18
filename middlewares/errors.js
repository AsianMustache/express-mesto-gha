const http2 = require("http2");

const MONGO_DUPLICATE_ERROR_CODE = 11000;

// module.exports = (err, req, res, next) => {
//   if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
//     return res
//       .status(http2.constants.HTTP_STATUS_CONFLICT)
//       .send({ message: "Этот email уже используется" });
//   }

//   // Обработка неверного токена
//   if (err.name === "JsonWebTokenError") {
//     return res
//       .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
//       .send({ message: "Некорректный токен" });
//   }

//   // По умолчанию возвращаем 500 ошибку
//   const statusCode =
//     err.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
//   res.status(statusCode).send({
//     message:
//       statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
//         ? "На сервере произошла ошибка"
//         : err.message,
//   });
// };
module.exports = (err, req, res, next) => {
  // Обработка ошибок валидации Joi
  if (err && err.isJoi) {
    return res.status(400).json({
      message: "Ошибка валидации данных",
      errors: err.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  // Обработка ошибки дублирования email
  if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
    return res
      .status(http2.constants.HTTP_STATUS_CONFLICT)
      .send({ message: "Этот email уже используется" });
  }

  // Обработка неверного токена
  if (err.name === "JsonWebTokenError") {
    return res
      .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Некорректный токен" });
  }

  // По умолчанию возвращаем 500 ошибку
  const statusCode =
    err.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  res.status(statusCode).send({
    message:
      statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? "На сервере произошла ошибка"
        : err.message,
  });
};
