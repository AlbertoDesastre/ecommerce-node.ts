const faker = require('faker');
const handleConnection = require('../store/mysql');

class ProductService {
  constructor() {
    this.connection = handleConnection();
  }

  async list() {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM products', (err, data) => {
        if (err) {
          console.error('Error ocurred when getting products', err.mesage);
          reject(err);
        } else {
          /* I have to do a map because in reality what's coming from the query are objects called "RowDataPocket", and I want to access the objects
          on the array without calling that attribute */
          const products = data.map((objetFromQuery) => ({
            ...objetFromQuery,
          }));

          /* console.log('ESTA ES LA DATA -->', products); */
          resolve(products);
        }
      });
    });
  }

  /*  */
  get({ id }) {
    return this.products.filter((product) => product.id === id);
  }
  getByName({ name }) {
    const nameInLowerCase = name.toLowerCase();

    return this.products.filter(
      (product) => product.name.toLowerCase() === nameInLowerCase
    );
  }
  create(product) {
    console.log(product);

    return new Promise((resolve, reject) => {
      this.connection.query(
        'INSERT INTO products SET ?',
        product,
        (err, data) => {
          if (err) {
            console.error(err.message);
            return reject(err);
          }
          resolve(data);
        }
      );
    });
  }

  /*
  create(product) {
    console.log(product);

    return new Promise((resolve, reject) => {
      this.connection.query(
        'INSERT INTO products (category_id, name, description, price, quantity, image) VALUES (?)',
        product,
        (err, data) => {
          if (err) {
            console.error(err.message);
            return reject(err);
          }
          resolve(data);
        }
      );
    });
  }

  Explanation:
  The create function is responsible for inserting a product into the database. It takes a product object as input, which should contain the necessary details for the insertion. However, there was an issue with this code that prevented it from working correctly.

  The problem lies in the SQL query used for the insertion. The query specified a single placeholder ? to represent the values to be inserted. However, when passing the product object as the second parameter in the query function, the values were not assigned correctly to the placeholder.

  To fix this issue, the query should be modified to use a syntax that allows for the automatic assignment of values from an object. One such syntax is SET ?, where the ? represents the object to be inserted. This syntax ensures that the values from the object are correctly mapped to the corresponding columns in the query.

  By making this modification, the create function will now work as intended, inserting the product into the database.
  */

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
