const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/UnauthorizedError");

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  if (!token) {
    return next(new UnauthorizedError("Требуется авторизация")); // Использование класса ошибки
  }

  let payload;

  try {
    payload = jwt.verify(token, "dev_secret");
  } catch (err) {
    next(new UnauthorizedError("Неверный токен"));
  }

  req.user = payload;
  next();
};

module.exports = auth;
