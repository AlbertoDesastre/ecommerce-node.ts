import express from "express";
import { AuthController } from "./controllers";

const router = express.Router();

const authController = new AuthController();

router.get("/checkToken", authController.chekUserToken);
router.post("/eliminate/:id", authController.eliminateUser);

export { router };
