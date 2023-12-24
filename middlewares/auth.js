const jwt = require("jsonwebtoken");
// const http2 = require("http2");
const UnauthorizedError = require("../utils/UnauthorizedError");

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  console.log("Полученный токен: ", token);
  if (!token) {
    console.log("Ошибка: Требуется авторизация");
    // return next(new UnauthorizedError("Требуется авторизация"));
  }

  try {
    const payload = jwt.verify(token, "dev_secret");
    req.user = payload;
    console.log("Токен успешно проверен, payload: ", payload);
    next();
  } catch (err) {
    console.log("Ошибка при проверке токена: ", err);
    next(new UnauthorizedError("Неверный токен"));
  }
};

module.exports = auth;
