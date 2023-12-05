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
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    }
    res.status(200).send({ message: "Карточка удалена" });
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
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
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
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
