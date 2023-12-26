const express = require("express");

const mongoose = require("mongoose");
const { errors: celebrateErrors } = require("celebrate");
const rootRouter = require("./routes/index");
const errorHandler = require("./middlewares/errors");
const NotFoundError = require("./utils/NotFoundError");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.log("Ошибка подключения:", err.message);
  });

app.use(express.json());

app.use("/", rootRouter);

app.use(celebrateErrors());
app.use(errorHandler);

app.use("*", (err, req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
