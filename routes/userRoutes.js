const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUserById);
// router.post("/", userController.createUser);
router.patch("/me", userController.updateProfile);
router.patch("/me/avatar", userController.updateAvatar);
router.get("/me", auth, userController.getCurrentUser);

module.exports = router;
