const express = require('express');

const ProductsService = require('../services/products.service');
const { success, error } = require('../network');
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

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const searchedProduct = productsService.getOneById({ id });

  if (searchedProduct.length === 0) {
    return res.status(404).json({ message: 'No product meets the criteriah' });
  } else {
    return res
      .status(201)
      .json({ message: 'This product is available', product: searchedProduct });
  }
});

router.post('/', (req, res) => {
  if (!req.body) {
    return error({
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
        message: 'Product created',
        data: result,
        status: 201,
      });
    })
    .catch((err) => {
      return error({ res, message: err, status: 500 });
    });
});

router.post('/createMany', (req, res) => {
  if (!req.body) {
    return error({
      req,
      res,
      message: "You didn't provide a body",
      status: 400,
    });
  }

  productsService
    .createMany(req.body)
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
      return error({ res, message: err, status: 500 });
    });
});

module.exports = router;
