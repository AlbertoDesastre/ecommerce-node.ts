import { MysqlError } from "mysql";

import { pool, handleConnection } from "../../store/mysql";
import { FilterQueries, Product } from "./types";
import { MysqlQueryResult, TableColumns } from "../../store/types";

class ProductService {
  private connection;
  constructor() {
    /*  this.connection = pool; */
    this.connection = handleConnection();
  }

  async list({ limit = "15", offset = "0" }) {
    /* const products = await this.connection.query(...) */
    const products = (await this.connection.list({
      table: "products",
      limit,
      offset,
    })) as Product[] | MysqlError;

    return products;
  }

  async filterBy({ name, price, color }: FilterQueries) {
    /* This function constructs the conditions and filters arrays based on the provided values. Each filter is added to the respective array.
      The conditions array holds the SQL conditions for filtering, and the filters array holds the corresponding filter values.
      The filters are modified appropriately (e.g., adding '%' to perform a partial string match or converting the price to an integer).
      The function then calls the filterBy function of mysqlStore with the table name, conditions, and filters as arguments. */

    let conditionsElements: string[] = [];
    let filters: string[] = [];
    let conditions = "";

    if (name) {
      conditionsElements.push("name LIKE ?");
      filters.push(`%${name}%`);
    }
    if (price) {
      conditionsElements.push("price <= ?");
      filters.push(price);
    }
    if (color) {
      conditionsElements.push("color LIKE ?");
      filters.push(`%${color}%`);
    }
    /* For example, in case of the consumer searching for all 3 filters, the "conditions" would look like: [ '%ca%', 800, '%black%' ]
        Notice that string are already including "%%" to make the later SQL query work with "LIKE"  */

    if (conditionsElements.length > 0) {
      conditions = conditionsElements.join(" AND ");
      /* For every filter, an "AND" it's included automatically to concatenate more than one filter if necessary.
          For example, if we had all 3 filters the "conditions" will look like this string: "name LIKE ?  AND price <= ?  AND color LIKE ?"   */
    }

    const result = await this.connection.filterBy({
      table: "products",
      conditions,
      filters,
    });

    return result;
  }

  async getOne(id: string) {
    return await this.connection.getOne({
      table: "products",
      id,
      addExtraQuotesToId: true,
    });
  }

  async create(productsInArrayOfJsons: Product[]) {
    const data = productsInArrayOfJsons.map((product) => [
      ...Object.values(product),
    ]);

    /* Pending to be corrected. In reality it's not returning products but a message from mysql */
    const result = await this.connection.create({
      table: "products",
      tableColumns: TableColumns.PRODUCTS,
      arrayOfData: data,
    });

    return result as MysqlQueryResult;
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

  async update({ product }: { product: Product }) {
    const productId = product.id.toString();

    const data = await this.connection.update({
      table: "products",
      item: product,
      id: productId,
    });

    return data;
  }

  async deactivateProduct({ id }: { id: string }) {
    const result = await this.connection.toggleItemStatus({
      table: "products",
      boolean: "FALSE",
      id,
    });

    return result;
  }
}

export { ProductService };
