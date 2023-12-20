const jwt = require("jsonwebtoken");
const http2 = require("http2");
const { UnauthorizedError } = require("../middlewares/errors");

const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  // if (!token) {
  //   return res
  //     .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
  //     .send({ message: "Требуется авторизация" });
  // }
  if (!token) {
    return next(new UnauthorizedError("Требуется авторизация")); // Использование класса ошибки
  }

  let payload;

  try {
    payload = jwt.verify(token, "dev_secret");
  } catch (err) {
    // return res
    //   .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
    //   .send({ message: "Неверный токен" });
    next(new UnauthorizedError("Неверный токен"));
  }

  req.user = payload;
  next();
};

module.exports = auth;
