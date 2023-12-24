const mongoose = require("mongoose");
// eslint-disable-next-line import/no-unresolved
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const ForbiddenError = require("../utils/ForbiddenErrors");
// const http2 = require("http2");
// const BadRequestError = require("../utils/BadRequestError");
// const NotFoundError = require("../utils/NotFoundError");
// const UnauthorizedError = require("../utils/UnauthorizedError");
// const ForbiddenError = require("../utils/ForbiddenErrors");

// const MONGO_DUPLICATE_ERROR_CODE = 11000;

// eslint-disable-next-line consistent-return
// module.exports = (err, req, res, next) => {
//   if (
//     err instanceof BadRequestError ||
//     err instanceof NotFoundError ||
//     err instanceof UnauthorizedError ||
//     err instanceof ForbiddenError
//   ) {
//     return res.status(err.status).send({ message: err.message });
//   }

//   res.status(500).send({ message: "На сервере произошла ошибка" });
//   // Обработка ошибок валидации Joi
//   if (err && err.isJoi) {
//     return res.status(400).json({
//       message: "Ошибка валидации данных",
//       errors: err.details.map((detail) => ({
//         field: detail.path.join("."),
//         message: detail.message,
//       })),
//     });
//   }

//   // Обработка ошибки дублирования email
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
// eslint-disable-next-line consistent-return
// const errorHandler = (err, req, res, next) => {
//   // Обработка ошибок валидации Joi
//   if (err && err.isJoi) {
//     return res.status(400).json({
//       message: "Ошибка валидации данных",
//       errors: err.details.map((detail) => ({
//         field: detail.path.join("."),
//         message: detail.message,
//       })),
//     });
//   }

//   // Обработка ошибки дублирования email
//   if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
//     return res
//       .status(http2.constants.HTTP_STATUS_CONFLICT)
//       .json({ message: "Этот email уже используется" });
//   }

//   // Обработка неверного токена
//   if (err.name === "JsonWebTokenError") {
//     return res
//       .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
//       .jsno({ message: "Некорректный токен" });
//   }

//   // Обработка кастомных ошибок
//   if (
//     err instanceof BadRequestError
//     || err instanceof NotFoundError
//     || err instanceof UnauthorizedError
//     || err instanceof ForbiddenError
//   ) {
//     return res.status(err.statusCode).json({ message: err.message });
//   }

//   // По умолчанию возвращаем 500 ошибку
//   const statusCode = err.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
//   res.status(statusCode).json({
//     message:
//       statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
//         ? "На сервере произошла ошибка"
//         : err.message,
//   });
//   next();
// };

// // eslint-disable-next-line consistent-return
// const errorHandler = (err, req, res) => {
//   // console.log("Ошибка: ", err);
//   // Обработка ошибок валидации Joi
//   if (err && err.isJoi) {
//     console.log("Ошибка валидации Joi: ", err);
//     return res.status(400).json({
//       message: "Ошибка валидации данных",
//       errors: err.details.map((detail) => ({
//         field: detail.path.join("."),
//         message: detail.message,
//       })),
//     });
//   }

//   // Обработка ошибки дублирования email
//   if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
//     console.log("Ошибка дублирования email: ", err);
//     return res
//       .status(http2.constants.HTTP_STATUS_CONFLICT)
//       .json({ message: "Этот email уже используется" });
//   }

//   // Обработка неверного токена
//   if (err.name === "JsonWebTokenError") {
//     console.log("Ошибка неверного токена: ", err);
//     return res
//       .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
//       .json({ message: "Некорректный токен" });
//   }

//   // Обработка кастомных ошибок
//   if (
//     err instanceof BadRequestError
//     || err instanceof NotFoundError
//     || err instanceof UnauthorizedError
//     || err instanceof ForbiddenError
//   ) {
//     console.log("Кастомная ошибка: ", err);
//     return res.status(err.status || 500).json({ message: err.message });
//   }

//   // По умолчанию возвращаем 500 ошибку
//   console.log("Необработанная ошибка сервера: ", err);
//   res
//     .status(500)
//     .json({ message: err.message || "На сервере произошла ошибка" });
// };

// module.exports = errorHandler;

// eslint-disable-next-line consistent-return
const errorHandler = (err, req, res) => {
  if (err instanceof mongoose.Error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
  }

  if (err.code === 11000) {
    return res
      .status(StatusCodes.CONFLICT)
      .send({ message: "Этот email уже используется" });
  }

  if (
    err instanceof BadRequestError
    || err instanceof NotFoundError
    || err instanceof UnauthorizedError
    || err instanceof ForbiddenError
  ) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err.name === "JsonWebTokenError") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Некорректный токен" });
  }

  // Обработка ошибок валидации Joi, если используется
  if (err.isJoi) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: "Ошибка валидации данных",
      details: err.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  // Для необработанных ошибок
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: "На сервере произошла ошибка" });
};

module.exports = errorHandler;
