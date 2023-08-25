import { AuthMiddleware } from "../../middlewares/auth-middleware";
import * as UserController from "./controllers";
import express from "express";

let authMiddleware = new AuthMiddleware();
const router = express.Router();

router.get("/get/:id", UserController.get);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update/:id", authMiddleware.checkToken, UserController.update);
router.delete("/delete/:id", UserController.eliminate);

export { router };
