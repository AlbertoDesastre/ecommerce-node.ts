import * as mysqlStore from "../store/mysql";
/* const { error } = require('../network'); */

class ProductService {
  constructor() {
    /*  this.connection = handleConnection(); */
  }
  async getOne({ id }) {
    return await mysqlStore.getOne({ table: "products", id });
  }

  async filterBy({ name, price, color }) {
    /* This function constructs the conditions and filters arrays based on the provided values. Each filter is added to the respective array.
    The conditions array holds the SQL conditions for filtering, and the filters array holds the corresponding filter values.
    The filters are modified appropriately (e.g., adding '%' to perform a partial string match or converting the price to an integer).
    The function then calls the filterBy function of mysqlStore with the table name, conditions, and filters as arguments. */
    try {
      /* fix this */
      let conditions: any = [];
      let filters = [];

      if (name) {
        conditions.push("name LIKE ? ");
        filters.push(`%${name}%`);
      }
      if (price) {
        conditions.push("price <= ? ");
        filters.push(parseInt(price));
      }
      if (color) {
        conditions.push("color LIKE ? ");
        filters.push(`%${color}%`);
      }
      /* For example, in case of the consumer searching for all 3 filters, the "conditions" would look like: [ '%ca%', 800, '%black%' ]
      Notice that string are already including "%%" to make the later SQL query work with "LIKE"  */

      if (conditions.length > 0) {
        conditions = conditions.join(" AND ");
        /* For every filter, an "AND" it's included automatically to concatenate more than one filter if necessary.
        For example, if we had all 3 filters the "conditions" will look like this string: "name LIKE ?  AND price <= ?  AND color LIKE ?"   */
      }

      /* console.log('filters -->', filters);
      console.log('conditions -->', conditions); */

      return await mysqlStore.filterBy({
        table: "products",
        conditions,
        filters,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Before this params were numbers. They were changed so TS doesn't complain */
  async list({ limit = "15", offset = "0" }) {
    /* fix thiss */
    const products: any = await mysqlStore.list({
      table: "products",
      limit,
      offset,
    });
    products.map((objetFromQuery) => ({
      ...objetFromQuery,
    }));

    return products;
  }

  async create(productsInArrayOfJsons) {
    const data = productsInArrayOfJsons.map((product) => [
      ...Object.values(product),
    ]);

    /* Pending to be corrected. In reality it's not returning products but a message from mysql */
    const products = await mysqlStore.create("products", data);

    return products;
  }

  /*
  **OLD VERSION OF 'create' THAT DIDN'T WORK, AN EXPLANATION OF WHY**

  create(product) {

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

  async update({ product }) {
    const productId = product.id;

    const data = await mysqlStore.update({
      table: "products",
      item: product,
      id: productId,
    });

    return data;
  }

  async deactivateProduct({ id }) {
    const result = await mysqlStore.toggleItemStatus({
      table: "products",
      boolean: "FALSE",
      id,
    });

    return result;
  }
}

export { ProductService };
/* module.exports = ProductService; */