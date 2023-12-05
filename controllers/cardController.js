const mongoose = require("mongoose");

const Card = require("../models/card");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json({ data: cards });
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
    } else {
      res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Некорректный ID" });
  }

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    }

    await card.remove();
    res.status(200).send({ message: "Карточка удалена" });
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

exports.likeCard = async (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Некорректный ID карточки" });
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    }

    res.status(200).json(card);
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Некорректный ID карточки" });
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    }

    res.status(200).json(card);
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};
