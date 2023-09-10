import express from "express";

import { CategoryController } from "./controllers";

const router = express.Router();

const categoryController = new CategoryController();

router.get("/", (req, res) => {
  categoryController.list(req, res);
});

router.get("/filter", (req, res) => {
  categoryController.filterBy(req, res);
});

/* always put routes that requires dynamic data at the end, or the routs with fixed words won't be accesible */
router.get("/:id", (req, res) => {
  categoryController.getOne(req, res);
});

router.post("/", (req, res) => {
  categoryController.create(req, res);
});

router.put("/", (req, res) => {
  categoryController.update(req, res);
});

router.delete("/:id", (req, res) => {
  categoryController.deactivateCategory(req, res);
});

export { router };
