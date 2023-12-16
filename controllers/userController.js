const mongoose = require("mongoose");
const http2 = require("http2");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Получение всех пользователей
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: users });
  } catch (err) {
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "На сервере произошла ошибка" });
    next(err);
  }
};

// Получение пользователя по ID
exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail(
      new Error("Пользователь не найден")
    );
    res.status(http2.constants.HTTP_STATUS_OK).json(user);
  } catch (err) {
    // if (err.message === "Пользователь не найден") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_NOT_FOUND)
    //     .send({ message: err.message });
    // }
    // if (err.name === "CastError") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
    //     .send({ message: "Неверный формат ID" });
    // }
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "На сервере произошла ошибка" });
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    });
  } catch (err) {
    // if (err.name === "ValidationError") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
    //     .send({ message: "Переданы некорректные данные" });
    // }
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "На сервере произошла ошибка" });
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).orFail(new Error("Запрашиваемый пользователь не найден"));
    res.status(http2.constants.HTTP_STATUS_OK).json(updatedUser);
  } catch (err) {
    // if (err.message === "Запрашиваемый пользователь не найден") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_NOT_FOUND)
    //     .send({ message: err.message });
    // }
    // if (err.name === "ValidationError") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
    //     .send({ message: "Неверный формат данных или ID пользователя" });
    // }
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "На сервере произошла ошибка" });
    next(err);
  }
};

// Обновление аватара пользователя
exports.updateAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    ).orFail(new Error("Запрашиваемый пользователь не найден"));
    res.status(http2.constants.HTTP_STATUS_OK).json(updatedUser);
  } catch (err) {
    // if (err.message === "Запрашиваемый пользователь не найден") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_NOT_FOUND)
    //     .send({ message: err.message });
    // }
    // if (err.name === "ValidationError") {
    //   return res
    //     .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
    //     .send({ message: "Неверный формат данных или ID пользователя" });
    // }
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "На сервере произошла ошибка" });
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
        .send({ message: "Неверные почта или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
        .send({ message: "Неверные почта или пароль" });
    }

    const token = jwt.sign({ _id: user._id }, "Секретный_ключ", {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    });

    res
      .status(http2.constants.HTTP_STATUS_OK)
      .send({ message: "Аутентификация прошла успешно" });
  } catch (err) {
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "На сервере произошла ошибка" });
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: "Пользователь не найден" });
    }

    res.status(http2.constants.HTTP_STATUS_OK).json({
      name: user.name,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (error) {
    // res
    //   .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: "Ошибка на сервере" });
    next(err);
  }
};
