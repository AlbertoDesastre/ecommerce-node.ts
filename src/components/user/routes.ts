import express from "express";

import { AuthMiddleware } from "../../middlewares/auth-middleware";
import * as UserController from "./controllers";

let authMiddleware = new AuthMiddleware();
const router = express.Router();

router.get("/:id", UserController.get);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/:id", authMiddleware.checkToken, UserController.update);
router.delete("/:id", authMiddleware.checkToken, UserController.eliminate);

export { router };
