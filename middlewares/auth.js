require("dotenv").config();

const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/UnauthorizedError");
// const jwt = require("jsonwebtoken");
// // const http2 = require("http2");
// const UnauthorizedError = require("../utils/UnauthorizedError");

// // eslint-disable-next-line consistent-return
// const auth = (req, res, next) => {
//   const token = req.headers.authorization
//     ? req.headers.authorization.replace("Bearer ", "")
//     : null;
//   console.log("Полученный токен: ", token);
//   // if (!token) {
//   //   console.log("Ошибка: Требуется авторизация");
//   //   return next(new UnauthorizedError("Требуется авторизация"));
//   // }
//   if (!token) {
//     console.log("Ошибка: Требуется авторизация");
//     return Promise.reject(new UnauthorizedError("Требуется авторизация")).catch(
//       next
//     );
//   }

//   try {
//     const payload = jwt.verify(token, "dev_secret");
//     req.user = payload;
//     console.log("Токен успешно проверен, payload: ", payload);
//     next();
//   } catch (err) {
//     console.log("Ошибка при проверке токена: ", err);
//     // next(new UnauthorizedError("Неверный токен"));
//   }
// };

// module.exports = auth;

// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError("Необходима авторизация"));
  }
};
