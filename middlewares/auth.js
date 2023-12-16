const jwt = require("jsonwebtoken");
const http2 = require("http2");

const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  if (!token) {
    return res
      .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Требуется авторизация" });
  }

  let payload;

  try {
    payload = jwt.verify(token, "Секретный_ключ");
  } catch (err) {
    return res
      .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Неверный токен" });
  }

  req.user = payload;
  next();
};

module.exports = auth;
