const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const {
  updateUserSchema,
  updateAvatarSchema,
  userIdSchema,
} = require("../validation/validation");
const auth = require("../middlewares/auth");
const { celebrate } = require("celebrate");

router.get("/", userController.getAllUsers);
// router.get("/:userId", userController.getUserById);
router.get("/:userId", celebrate(userIdSchema), userController.getUserById);
router.patch(
  "/me",
  celebrate({ body: updateUserSchema }),
  userController.updateProfile
);
router.patch(
  "/me/avatar",
  celebrate({ body: updateAvatarSchema }),
  userController.updateAvatar
);
router.get("/me", auth, userController.getCurrentUser);

module.exports = router;
