const express = require("express");

const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/userController");
const rootRouter = require("./routes/index");
const userRouter = require("./routes/userRoutes");
const auth = require("./middlewares/auth");
const errors = require("./middlewares/errors");
const { createUserSchema } = require("./validation/validation");
const validate = require("./middlewares/validate");

const app = express();
const PORT = 3000;
const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.error("Ошибка подключения:", err.message);
  });

app.use(express.json());

app.post("/signup", validate(createUserSchema), createUser);
app.post("/signin", login);

app.use(auth);

app.use("/", rootRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.status(HTTP_OK).send({ message: "Я сработал" });
});

app.use(errors);

app.use((req, res) => {
  res.status(HTTP_NOT_FOUND).json({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
