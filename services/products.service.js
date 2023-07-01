const faker = require('faker');
const handleConnection = require('../store/mysql');

class ProductService {
  constructor() {
    this.connection = handleConnection();
  }

  /* This functions it's not returning any products really. What's happening it's that connection.query takes time to retrieve data,
  and I'm not waiting for that operation to be finished. The only thing I'm doing an "await", but that doesn't wait for the operation
  to be processed, so it basically gets called when it's unfinished and I always receive undefined.*/
  async get() {
    await this.connection.query('SELECT * FROM products', (err, data) => {
      if (err) {
        console.error('Error ocurred when getting products', err.mesage);
      } else {
        const products = data.map((objetFromQuery) => ({ ...objetFromQuery }));

        return products;
      }
    });
  }

  /*  */
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
