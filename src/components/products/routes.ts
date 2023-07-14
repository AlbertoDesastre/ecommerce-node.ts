import type { Request, Response } from "express";
import express from "express";
import { ProductController } from "./controllers";

const router = express.Router();

const productController = new ProductController();

router.get("/", (req, res) => {
  productController.list(req, res);
});

router.get("/filter", (req, res) => {
  productController.filterBy(req, res);
});

/* always put routes that requires dynamic data at the end, or the routs with fixed words won't be accesible */
router.get("/:id", (req, res) => {
  productController.getOne(req, res);
});

router.post("/", (req, res) => {
  productController.create(req, res);
});

router.put("/", (req, res) => {
  productController.update(req, res);
});

router.delete("/:id", (req, res) => {
  productController.deactivateProduct(req, res);
});

export { router };
