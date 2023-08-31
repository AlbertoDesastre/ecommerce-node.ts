import { MysqlError } from "mysql";

import { pool, handleConnection } from "../../store/mysql";
import { FilterQueries, Order } from "./types";
import { MysqlQueryResult, TableColumns } from "../../store/types";

class OrderService {
  private connection;
  constructor() {
    this.connection = handleConnection();
  }

  /* Methods to add:
  list order by User
  list orders that has X item
  list orders by date
  create order
  cancel order but not deleting it
  update order status (probably requires changes on DB as is right now)
  */

  async list({ limit = "15", offset = "0" }) {
    const orders = (await this.connection.list({
      table: "orders",
      limit,
      offset,
    })) as Order[] | MysqlError;

    return orders;
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
      table: "orders",
      conditions,
      filters,
    });

    return result;
  }

  async getOne(id: string) {
    return await this.connection.getOne({
      table: "orders",
      // CHANGE THIS!!
      tableColumns: TableColumns.PRODUCTS_GET_VALUES,
      id,
      addExtraQuotesToId: true,
    });
  }

  async create(productsInArrayOfJsons: Order[]) {
    const data = productsInArrayOfJsons.map((order) => [
      ...Object.values(order),
    ]);

    /* Pending to be corrected. In reality it's not returning orders but a message from mysql */
    const result = await this.connection.create({
      table: "orders",
      // CHANGE THIS!!
      tableColumns: TableColumns.PRODUCTS_POST_VALUES,
      // CHANGE THIS!!
      arrayOfData: data as any,
    });

    return result as MysqlQueryResult;
  }

  async update({ order }: { order: Order }) {
    const productId = order.id.toString();

    const data = await this.connection.update({
      table: "orders",
      item: order,
      id: productId,
    });

    return data;
  }

  async deactivateProduct({ id }: { id: string }) {
    const result = await this.connection.toggleItemStatus({
      table: "orders",
      boolean: "FALSE",
      id,
    });

    return result;
  }
}

export { OrderService };
