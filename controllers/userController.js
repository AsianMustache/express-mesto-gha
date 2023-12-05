const mongoose = require("mongoose");

const User = require("../models/user");

// Получение всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

// Получение пользователя по ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: "Некорректный ID пользователя" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Пользователь не найден" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

// Создание нового пользователя
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: "Переданы некорректные данные" });
    }
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: "Переданы некорректные данные" });
    }
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

// Обновление аватара пользователя
exports.updateAvatar = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: "Переданы некорректные данные" });
    }
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};
