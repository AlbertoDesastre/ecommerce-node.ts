import { MysqlError } from "mysql";

import { pool, handleConnection } from "../../store/mysql";
import {
  OrderModel,
  OrderItemModel,
  OrderStatus,
  OrdersTableColumns,
  FilterQueries,
  OrdersQueries,
  OrdersWithItems,
  FormattedOrders,
} from "./types";
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

  //CORRECT THIS METHOD, IF YOU PLACE A LIMIT IT TAKES OUT POSSIBLE AN ITEM_ORDER THAT'S OWNED BY ALREADY SHOWN ORDER
  async list({ limit = "a", offset = "0" }) {
    const ordersWithItems = (await this.connection.personalizedQuery(
      OrdersQueries.GET_ORDERS_AND_ORDER_ITEMS +
        ` LIMIT ${limit} OFFSET ${offset};`
    )) as OrdersWithItems[] | MysqlError;

    if (!Array.isArray(ordersWithItems)) {
      return ordersWithItems;
    } else {
      return this.formatOrders(ordersWithItems);
    }
  }

  formatOrders(ordersWithItems: OrdersWithItems[]): FormattedOrders[] {
    // Map is an object that it's build with a pair of key-values. Each key is unique and cannot be find twice in the same Map.
    // The content of a key can be updated or overwritten. This is wonderful for grouping order_items by a same order_id.

    const orderMap: Map<number, FormattedOrders> = new Map();

    ordersWithItems.forEach((order) => {
      let orderExists = orderMap.get(order.id);

      if (!orderExists) {
        //if the order hasn't been defined yet in the Map, we define it with it's first values and create products array
        orderMap.set(order.id, {
          id: order.id,
          user_id: order.user_id,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          products: [
            {
              order_item_id: order.order_item_id,
              product_id: order.product_id,
              quantity: order.quantity,
              subtotal: order.subtotal,
            },
          ],
        });
      } else {
        // since the Order and products array it's on the map we can update it's value by pushing new content
        orderExists.products.push({
          order_item_id: order.order_item_id,
          product_id: order.product_id,
          quantity: order.quantity,
          subtotal: order.subtotal,
        });
      }
    });

    return [...orderMap.values()];
  }

  /* async filterBy({ productName, orderCreatedDate }: FilterQueries) {

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

    if (conditionsElements.length > 0) {
      conditions = conditionsElements.join(" AND ");
    }

    const result = await this.connection.filterBy({
      table: "orders",
      conditions,
      filters,
    });

    return result;
  } */

  async getOne(id: string) {
    return await this.connection.getOne({
      table: "orders",
      // CHANGE THIS!!
      tableColumns: TableColumns.PRODUCTS_GET_VALUES,
      id,
      addExtraQuotesToId: true,
    });
  }

  async create(productsInArrayOfJsons: OrderModel[]) {
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

  async update({ order }: { order: OrderModel }) {
    const productId = order.id.toString();

    const data = await this.connection.update({
      table: "orders",
      item: order,
      id: productId,
    });

    return data;
  }

  async cancellOrder({ id }: { id: string }) {
    const result = await this.connection.toggleItemStatus({
      table: "orders",
      boolean: "FALSE",
      id,
    });

    return result;
  }
}

export { OrderService };
