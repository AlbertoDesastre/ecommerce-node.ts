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

enum TableColumns {
  ORDER_POST_VALUES = "(user_id, total_amount)",
  ORDER_GET_FULL_VALUES = " o.id AS order_id, o.user_id, o.total_amount, o.status, o.created_at AS order_created_at, oi.id AS order_item_id,oi.product_id,oi.quantity,oi.subtotal, oi.created_at AS order_item_created_at",
  ORDER_GET_PARTIAL_INFO = "id, user_id, total_amount, status, modified_at, created_at",
  ORDER_ITEMS_POST_VALUES = "(order_id, product_id, quantity, subtotal)",
  ORDER_ITEMS_GET_VALUES = "id, order_id, product_id, quantity,  subtotal, created_at",
}

export {
  OrderModel,
  OrderItemModel,
  OrderStatus,
  OrderPostRequestModel,
  OrdersQueries,
  OrdersTableColumns,
  TableColumns,
};
