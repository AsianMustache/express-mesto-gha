const express = require("express");

const mongoose = require("mongoose");

// const userRoutes = require("./routes/userRoutes");
// const cardRoutes = require("./routes/cardRoutes");
const rootRouter = require("./routes/index");

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
    console.error("Ошибка подключения:", err.message);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "656f3a96e42bc2e806180894", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/", rootRouter);

// app.use("/users", userRoutes);
// app.use("/cards", cardRoutes);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Я сработал" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
