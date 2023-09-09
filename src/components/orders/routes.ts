import express from "express";

import { OrderController } from "./controllers";

const router = express.Router();

const orderController = new OrderController();

router.get("/", (req, res) => {
  orderController.list(req, res);
});

router.get("/filter", (req, res) => {
  orderController.filterBy(req, res);
});

/* always put routes that requires dynamic data at the end, or the routs with fixed words won't be accesible */
router.get("/:orderId", (req, res) => {
  orderController.getOne(req, res);
});

router.post("/", (req, res) => {
  orderController.create(req, res);
});

router.put("/", (req, res) => {
  orderController.updateStatus(req, res);
});

export { router };
