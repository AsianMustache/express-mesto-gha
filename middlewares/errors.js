const http2 = require("http2");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const ForbiddenError = require("../utils/ForbiddenErrors");

const MONGO_DUPLICATE_ERROR_CODE = 11000;

// eslint-disable-next-line consistent-return
module.exports = (err, req, res, next) => {
  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    return res.status(err.status).send({ message: err.message });
  }

  res.status(500).send({ message: "На сервере произошла ошибка" });
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

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
