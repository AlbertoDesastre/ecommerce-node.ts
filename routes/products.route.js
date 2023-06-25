const express = require('express');
const faker = require('faker');
const ProductsService = require('../services/products.service');
const router = express.Router();

const productsService = new ProductsService();

/* The difference between reading req.query and req.params is that queries are OPTIONAL and can be non-existen. Params will always exist */
router.get('/', (req, res) => {
  const products = productsService.get();

  res.status(201).json(products);
});

/* This route only exists to show that we put first every route that it's fixed, and after that we put the rest
of dinamycally built routes. "products/filter" and "products/:id" are extremely similar, but if we called the one
with "id" first, "filter" route would never be reached */
router.get('/filter', (req, res) => {
  res.send("I'm a filter");
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  // I create random products everytime and then I pick up only the one who it's equal to the parameter
  const products = [];
  for (let index = 0; index < 100; index++) {
    products.push({
      id: faker.datatype.uuid(),
      name: faker.commerce.product(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    });
  }

  const searchedProduct = products.filter((product) => product.id == id);

  res.json(searchedProduct);
});

module.exports = router;
