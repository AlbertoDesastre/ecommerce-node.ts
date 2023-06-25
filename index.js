require('dotenv').config();
const express = require('express');
const app = express();
const faker = require('faker');

app.get('/products', (req, res) => {
  const products = [];
  for (let index = 0; index < 100; index++) {
    products.push({
      id: index,
      name: faker.commerce.product(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    });
  }

  res.json(products);
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
