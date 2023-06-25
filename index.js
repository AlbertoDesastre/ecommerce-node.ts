require('dotenv').config();
const express = require('express');
const app = express();
const faker = require('faker');

/* The difference between reading req.query and req.params is that queries are OPTIONAL and can be non-existen. Params will always exist */
app.get('/products', (req, res) => {
  const { size } = req.query;
  const limit = size || 10;

  const products = [];
  for (let index = 0; index <= limit; index++) {
    products.push({
      id: index,
      name: faker.commerce.product(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    });
  }

  res.json(products);
});

/* This route only exists to show that we put first every route that it's fixed, and after that we put the rest
of dinamycally built routes. "products/filter" and "products/:id" are extremely similar, but if we called the one
with "id" first, "filter" route would never be reached */
app.get('/products/filter', (req, res) => {
  res.send("I'm a filter");
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;

  // I create random products everytime and then I pick up only the one who it's equal to the parameter
  const products = [];
  for (let index = 0; index < 100; index++) {
    products.push({
      id: index,
      name: faker.commerce.product(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    });
  }

  const searchedProduct = products.filter((product) => product.id == id);

  res.json(searchedProduct);
});

app.get('/goodbye', (req, res) => {
  res.send('Sayonara baby');
});

app.listen(process.env.PORT, () => {
  console.log('Listening at port: ', process.env.PORT);
});
