const mongoose = require("mongoose");

const http2 = require("http2");
const Card = require("../models/card");

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: cards });
  } catch (err) {
    next(err);
  }
};

exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(http2.constants.HTTP_STATUS_CREATED).json(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: err.message });
    }
    next(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Некорректный ID карточки" });
  }

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: "Карточка не найдена" });
    }

    await Card.deleteOne({ _id: cardId });
    res
      .status(http2.constants.HTTP_STATUS_OK)
      .send({ message: "Карточка удалена" });
  } catch (err) {
    next(err);
  }
};

exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Некорректный ID карточки" });
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: "Карточка не найдена" });
    }

    res.status(http2.constants.HTTP_STATUS_OK).json(card);
  } catch (err) {
    next(err);
  }
};

exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Некорректный ID карточки" });
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: "Карточка не найдена" });
    }

    res.status(http2.constants.HTTP_STATUS_OK).json(card);
  } catch (err) {
    next(err);
  }
};
