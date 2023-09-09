type FilterQueries = {
  productName?: string;
  // take a date in query params like "2023-08-08" and then apply logic to do the select query
  itemCreatedAt?: string;
};

enum OrderStatus {
  PAYMENT_PENDING = "payment_pending",
  RECEIVED = "received",
  PREPARING = "preparing",
  SHIPPING = "shipping",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

type OrderModel = {
  id: number;
  user_id: string;
  total_amount: number;
  order_status: OrderStatus;
  modified_at: Date | null;
  created_at: Date | null;
};

type OrderItemModel = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
  created_at: Date | null;
};

type FormattedOrders = {
  id: number;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  products: Array<{
    order_item_id: number;
    product_id: number;
    name: string;
    color: string;
    quantity: number;
    subtotal: number;
  }>;
};

type OrderWithItems = {
  id: number;
  user_id: string;
  total_amount: number;
  status: string;
  order_created_at: string;
  order_item_id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
};

interface OrderWithProductsInfo extends OrderWithItems {
  name: string;
  color: string;
}

type OrderPostRequestModel = {
  order_id: null;
  user_id: string;
  total_amount: number;
  products: Array<Omit<OrderItemModel, "id" | "category_id" | "created_at">>;
};

enum OrdersQueries {
  GET_ORDERS_AND_ORDER_ITEMS = "SELECT o.id, o.user_id, o.total_amount , o.created_at AS order_created_at,  oi.id AS order_item_id, p.name, p.color, oi.subtotal, oi.quantity,  oi.created_at as item_created_at, o.total_amount AS total_order_amount, o.status FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id",
  GET_ORDERS_AND_ORDER_ITEMS_WHERE_USER_ID = "SELECT o.id, o.user_id, o.total_amount , o.created_at AS order_created_at,  oi.id AS order_item_id, p.name, p.color, oi.subtotal, oi.quantity,  oi.created_at as item_created_at, o.total_amount AS total_order_amount, o.status FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id JOIN users u ON u.id = o.user_id",
  ORDER_BY_ORDERS_DATE = "ORDER BY o.created_at",
}

enum OrdersTableColumns {
  CREATE_ORDER = "(user_id, total_amount, status)",
  CREATE_ORDER_ITEMS = "(order_id, product_id, quantity, subtotal)",
}

enum OrderErrorMessage {
  ORDER_NOT_FOUND = "No order was found",
  USER_DOESNT_HAVE_ORDERS = "This user doesn't have any orders.",
  USER_DOESNT_EXISTS = "This consumer doesn't exists and therefore it doesn't have any orders.",
  ORDER_ITEM_DOESNT_EXISTS_WITH_THESE_PARAMS = "There are no orders with the name or creation date specified.",
}

export {
  FilterQueries,
  OrderModel,
  OrderItemModel,
  FormattedOrders,
  OrderStatus,
  OrderPostRequestModel,
  OrdersQueries,
  OrderWithItems,
  OrderWithProductsInfo,
  OrdersTableColumns,
  OrderErrorMessage,
};
