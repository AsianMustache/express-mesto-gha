const express = "express";
const app = express();
const PORT = 3000;
const mongoose = "mongoose";
mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Подключение к MongoDB установлено");
  })
  .catch((err) => {
    console.error("Ошибка подключения к MongoDB:", err.message);
  });

app.get("/", (req, res) => {
  res.send("Привет, мир!");
});

app.listen(PORT);
