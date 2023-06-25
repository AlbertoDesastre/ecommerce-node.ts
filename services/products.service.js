const faker = require('faker');

class ProductService {
  constructor() {
    this.products = [];
    this.generate();
  }

  get() {
    return this.products;
  }
  getOneById({ id }) {
    return this.products.filter((product) => product.id === id);
  }
  getByName() {}
  create() {}
  generate() {
    const limit = 100;

    for (let index = 0; index <= limit; index++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
      });
    }
  }
  update() {}
  delete() {}
}

module.exports = ProductService;
