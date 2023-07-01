const express = require('express');

const ProductsService = require('../services/products.service');
const router = express.Router();

const productsService = new ProductsService();

/* The difference between reading req.query and req.params is that queries are OPTIONAL and can be non-existen. Params will always exist */
router.get('/', async (req, res) => {
  const products = await productsService.get();

  console.log(products);
  res.status(201).json(products);
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

module.exports = router;
