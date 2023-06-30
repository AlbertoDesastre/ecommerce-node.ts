const faker = require('faker');
const handleConnection = require('../store/mysql');

class ProductService {
  constructor() {
    this.connection = handleConnection();
  }

  async get() {
    let products;
    console.log(this.connection);
    await this.connection.query('SELECT * FROM products', (err, data) => {
      if (err) {
        console.error('Error ocurred when getting products', err.mesage);
      } else {
        products = data;
        return products;
      }
    });
  }
  getOneById({ id }) {
    return this.products.filter((product) => product.id === id);
  }
  getByName({ name }) {
    const nameInLowerCase = name.toLowerCase();

    return this.products.filter(
      (product) => product.name.toLowerCase() === nameInLowerCase
    );
  }
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
