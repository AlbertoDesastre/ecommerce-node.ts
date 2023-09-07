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
  OrderErrorMessage,
  OrderPostRequestModel,
} from "./types";
import { MysqlQueryResult, TableColumns } from "../../store/types";

class OrderService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }

  /* Methods to add:
  list orders that has X item
  */

  //Adjust to bring full item info + do JOIN with user id, to check directly if it exists or not. If it doesn't it will return an empty array.
  async list({ userId }: { userId: string }) {
    const doesUserExist = await this.connection.getOne({
      table: "users",
      tableColumns: TableColumns.USERS_GET_PARTIAL_VALUES,
      id: userId,
      addExtraQuotesToId: true,
    });

    if (Array.isArray(doesUserExist) && doesUserExist.length === 0)
      return OrderErrorMessage.USER_DOESNT_EXISTS;

    const result = (await this.connection.personalizedQuery(
      OrdersQueries.GET_ORDERS_AND_ORDER_ITEMS_WHERE_USER_ID +
        ` WHERE u.id = "${userId}" ` +
        OrdersQueries.ORDER_BY_ORDERS_DATE
    )) as OrdersWithItems[] | MysqlError;

    if (!Array.isArray(result)) throw new Error(result.message);
    if (result.length === 0) return OrderErrorMessage.USER_DOESNT_HAVE_ORDERS;

    return this.formatOrders(result);
  }

  async filterBy({ productName, itemCreatedAt }: FilterQueries) {
    let conditionsElements: string[] = [];
    let conditions = "";

    if (productName) {
      conditionsElements.push(`p.name LIKE '%${productName}%'`);
    }
    if (itemCreatedAt) {
      conditionsElements.push(`oi.created_at LIKE '%${itemCreatedAt}%'`);
    }
    if (conditionsElements.length > 0) {
      conditions = conditionsElements.join(" AND ");
    }

    const result = await this.connection.personalizedQuery(
      OrdersQueries.GET_ORDERS_AND_ORDER_ITEMS +
        " WHERE " +
        conditions +
        OrdersQueries.ORDER_BY_ORDERS_DATE
    );

    if (Array.isArray(result) && result.length === 0)
      return OrderErrorMessage.ORDER_ITEM_DOESNT_EXISTS_WITH_THESE_PARAMS;
    if (!Array.isArray(result)) throw new Error(result.message);

    return this.formatOrders(result as OrdersWithItems[]);
  }

  // done
  async getOne(id: string): Promise<OrderModel[] | MysqlError> {
    const result = await this.connection.getOne({
      table: "orders",
      tableColumns: TableColumns.ORDER_GET_PARTIAL_INFO,
      id,
      addExtraQuotesToId: false,
    });

    if (Array.isArray(result) && result.length === 0)
      throw new Error(OrderErrorMessage.ORDER_NOT_FOUND);
    if (!Array.isArray(result)) throw new Error(result.message);

    return result as OrderModel[];
  }

  // done
  async create(order: OrderPostRequestModel) {
    const { user_id, total_amount, products } = order;

    const doesUserExist = await this.connection.getOne({
      table: "users",
      tableColumns: "id",
      id: user_id,
      addExtraQuotesToId: true,
    });

    if (Array.isArray(doesUserExist) && doesUserExist.length === 0)
      throw new Error(
        "You can't create an order to an user that doesn't exists."
      );

    const orderCreatedResult = await this.connection.create({
      table: "orders",
      tableColumns: TableColumns.ORDER_POST_VALUES,
      arrayOfData: [[user_id, total_amount]],
    });

    if (orderCreatedResult instanceof Error) {
      throw new Error("Failed to create the order.");
    }

    const orderItemsArray = products.map((order_item) => {
      order_item.order_id = orderCreatedResult.insertId;
      return Object.values(order_item);
    });

    const result = await this.connection.create({
      table: "order_items",
      tableColumns: TableColumns.ORDER_ITEMS_POST_VALUES,
      arrayOfData: orderItemsArray,
    });

    if (result instanceof Error)
      throw new Error(
        "Something wrong ocurred when creating the order's item/s."
      );

    return orderCreatedResult.insertId;
  }

  // done
  async updateStatus({ id, status }: { id: string; status: OrderStatus }) {
    const orderId = id.toString();

    const doesOrderExists = await this.connection.getOne({
      table: "orders",
      tableColumns: TableColumns.ORDER_GET_PARTIAL_INFO,
      id,
      addExtraQuotesToId: false,
    });

    if (Array.isArray(doesOrderExists) && doesOrderExists.length === 0) {
      throw new Error(OrderErrorMessage.ORDER_NOT_FOUND);
    }

    const result = await this.connection.update({
      table: "orders",
      item: { status },
      id: orderId,
    });

    return result;
  }

  // v HELPERS v

  errorOrEmptyChecker(
    data: Object[] | MysqlError,
    possibleErrorMessage: string
  ): string | Error | Object[] {
    if (Array.isArray(data) && data.length === 0) return possibleErrorMessage;
    if (!Array.isArray(data)) throw new Error(data.message);

    return data;
  }

  isValidOrderStatus(status: string): boolean {
    return Object.values(OrderStatus).includes(status as OrderStatus);
  }

  formatOrders(ordersWithItems: OrdersWithItems[]): FormattedOrders[] {
    // Map is an object that it's build with a pair of key-values. Each key is unique and cannot be find twice in the same Map.
    // The content of a key can be updated or overwritten. This is wonderful for grouping order_items by a same order_id.

    const orderMap: Map<number, FormattedOrders> = new Map();

    ordersWithItems.forEach((order) => {
      if (!orderMap.has(order.id)) {
        //if the order hasn't been defined yet in the Map, we define it with it's first values and create products array
        orderMap.set(order.id, {
          id: order.id,
          user_id: order.user_id,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          products: [],
        });
      }
      // since the Order and products array it's on the map we can update it's value by pushing new content
      orderMap.get(order.id)?.products.push({
        order_item_id: order.order_item_id,
        product_id: order.product_id,
        quantity: order.quantity,
        subtotal: order.subtotal,
      });
    });

    return [...orderMap.values()];
  }
}

export { OrderService };
