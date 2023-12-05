const express = "express";
const router = express.Router();
const userController = "../controllers/userController";

router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUserById);
router.post("/", userController.createUser);

export default router;
