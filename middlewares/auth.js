const jwt = require("jsonwebtoken");
const http2 = require("http2");
const UnauthorizedError = require("../utils/UnauthorizedError");

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  if (!token) {
    return next(new UnauthorizedError("Требуется авторизация"));
  }

  try {
    const payload = jwt.verify(token, "dev_secret");
    req.user = payload;
    next();
  } catch (err) {
    res
      .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
      .json({ message: "Неверный токен" });
  }
};

module.exports = auth;
