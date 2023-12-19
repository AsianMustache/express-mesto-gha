const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const {
  updateUserSchema,
  updateAvatarSchema,
} = require("../validation/validation");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { celebrate } = require("celebrate");

// router.post("/signup", validate(createUserSchema), userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUserById);
// router.post("/", userController.createUser);
// router.patch("/me", validate(updateUserSchema), userController.updateProfile);
router.patch(
  "/me",
  celebrate({ body: updateUserSchema }),
  userController.updateProfile
);
// router.patch(
//   "/me/avatar",
//   validate(updateAvatarSchema),
//   userController.updateAvatar
// );
router.patch(
  "/me/avatar",
  celebrate({ body: updateAvatarSchema }),
  userController.updateAvatar
);
router.get("/me", auth, userController.getCurrentUser);

module.exports = router;
