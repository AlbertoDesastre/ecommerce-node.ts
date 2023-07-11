import express from "express";
import { ProductService } from "../services/products.service";
import { success, errors } from "../network";

const router = express.Router();

const productsService = new ProductService();

router.get("/", (req, res) => {
  /*
  limit = number of maximum rows the DB should bring
  offset = where should the data start loading. For example, if offset is set to 10, it will start bring data from 10 and onwards
  */
  /*  const { limit, offset} = req.query; */

  const limit: any = req.query.limit;
  const offset: any = req.query.offset;

  productsService
    .list({ limit, offset })
    .then((products) => {
      return success({
        res,
        message: "This is the list of products",
        data: products,
        status: 201,
      });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

router.get("/filter", (req, res) => {
  /* REMINDER! What comes from params it's always a string */
  const { name, price, color } = req.query;

  /*   console.log(req.query); */

  productsService
    .filterBy({ name, price, color })
    .then((result: any) => {
      if (result.length === 0) {
        return errors({ res, message: "No product was found", status: 401 });
      } else {
        return success({
          res,
          message: "Product/s available...",
          data: result,
          status: 201,
        });
      }
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

/* always put routes that requires dynamic data at the end, or the routs with fixed words won't be accesible */
router.get("/:id", (req, res) => {
  /* REMINDER! What comes from params it's always a string */
  const { id } = req.params;

  /* data expected to be received = array */
  productsService
    .getOne({ id })
    .then((result: any) => {
      if (result.length === 0) {
        return errors({ res, message: "No product was found", status: 401 });
      } else {
        return success({
          res,
          message: "This product is available",
          data: result,
          status: 201,
        });
      }
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

router.post("/", (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return errors({
      res,
      message: "You didn't provide a body",
      status: 400,
    });
  }

  productsService
    .create(req.body)
    .then((result: any) => {
      return success({
        res,
        message: "All product/s created",
        data: result.message,
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

router.put("/", (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return errors({
      res,
      message: "You didn't provide a body",
      status: 400,
    });
  }

  productsService
    .update({ product: req.body })
    .then((result: any) => {
      return success({
        res,
        message: "The product was updated",
        data: result.message,
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  productsService
    .deactivateProduct({ id })
    .then((result: any) => {
      return success({
        res,
        message: "Product deactivated",
        data: result.message,
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

export { router };
