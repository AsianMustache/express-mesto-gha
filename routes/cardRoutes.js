const express = require("express");
const { celebrate, Joi } = require("celebrate");
const cardController = require("../controllers/cardController");
const { createCardSchema, cardIdSchema } = require("../validation/validation");

const router = express.Router();

router.get("/", cardController.getCards);
// router.post("/", cardController.createCard);
router.post(
  "/",
  celebrate({ body: createCardSchema }),
  cardController.createCard
);
router.delete("/:cardId", cardController.deleteCard);
router.put("/:cardId/likes", celebrate(cardIdSchema), cardController.likeCard);
// router.put("/:cardId/likes", cardController.likeCard);
// router.delete("/:cardId/likes", cardController.dislikeCard);
router.delete(
  "/:cardId/likes",
  celebrate(cardIdSchema),
  cardController.dislikeCard
);

module.exports = router;
