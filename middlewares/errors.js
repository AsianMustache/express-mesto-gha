const http2 = require("http2");

const MONGO_DUPLICATE_ERROR_CODE = 11000;

module.exports = (err, req, res, next) => {
  // Обработка ошибки дублирования email

  console.error("Ошибка:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
    name: err.name,
  });

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
