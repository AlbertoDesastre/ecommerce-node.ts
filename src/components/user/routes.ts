import express from "express";
import * as UserController from "./controllers";

const router = express.Router();

router.get("/get/:id", UserController.get);
router.post("/create", UserController.create);
router.put("/update/:id", UserController.update);
router.delete("/delete/:id", UserController.eliminate);

export { router };
