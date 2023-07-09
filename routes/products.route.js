const express = require('express');

const ProductsService = require('../services/products.service');
const { success, errors } = require('../network');
const ecommerceError = require('../utils/ecommerceError');
const router = express.Router();

const productsService = new ProductsService();

router.get('/', (req, res) => {
  /* I consume promises this way instead of the "async/await" approach to follow a common practice */
  productsService
    .list()
    .then((products) => {
      return success({ req, res, data: products, status: 201 });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

/* This route only exists to show that we put first every route that it's fixed, and after that we put the rest
of dinamycally built routes. "products/filter" and "products/:id" are extremely similar, but if we called the one
with "id" first, "filter" route would never be reached */

router.get('/getBy', (req, res) => {
  const { name } = req.query;

  const productsWithSameName = productsService.getByName({ name });
  res.status(201).json({ products: productsWithSameName });
});

router.get('/filter', (req, res) => {
  /* REMINDER! What comes from params it's always a string */
  const { name, price, color } = req.query;

  /*   console.log(req.query); */

  productsService
    .filterBy({ name, price, color })
    .then((result) => {
      if (result.length === 0) {
        return errors({ res, message: 'No product was found', status: 401 });
      } else {
        return success({
          res,
          message: 'Product/s available...',
          data: result,
          status: 201,
        });
      }
    })
    .catch((err) => {
      return ecommerceError({ error: err, code: 500 });
    });
});

/* always put routes that requires dynamic data at the end, or the routs with fixed words won't be accesible */
router.get('/:id', (req, res) => {
  /* REMINDER! What comes from params it's always a string */
  const { id } = req.params;

  /* data expected to be received = array */
  productsService
    .get({ id })
    .then((result) => {
      if (result.length === 0) {
        return errors({ res, message: 'No product was found', status: 401 });
      } else {
        return success({
          res,
          message: 'This product is available',
          data: result,
          status: 201,
        });
      }
    })
    .catch((err) => {
      return ecommerceError({ error: err, code: 500 });
    });
});

router.post('/', (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return errors({
      res,
      message: "You didn't provide a body",
      status: 400,
    });
  }

  productsService
    .create(req.body)
    .then((result) => {
      return success({
        req,
        res,
        message: 'Product/s created',
        data: result,
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

router.post('/', (req, res) => {
  if (!req.body) {
    return errors({
      req,
      res,
      message: "You didn't provide a body",
      status: 400,
    });
  }

  productsService
    .create(req.body)
    .then((result) => {
      return success({
        req,
        res,
        message: 'All products created',
        data: result,
        status: 201,
      });
    })
    .catch((err) => {
      return ecommerceError({ error: err, code: 401 });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  productsService
    .deactivateProduct({ id })
    .then((result) => {
      return success({
        req,
        res,
        message: 'Product deactivated',
        data: result.message,
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: err, status: 500 });
    });
});

module.exports = router;
