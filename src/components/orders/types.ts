type FilterQueries = {
  productName?: string;
  // take a date in query params like "2023-08-08" and then apply logic to do the select query
  orderCreatedDate?: string;
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
    quantity: number;
    subtotal: number;
  }>;
};

type OrdersWithItems = {
  id: number;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_item_id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
};

type OrderPostRequestModel = {
  order_id: null;
  user_id: string;
  total_amount: number;
  products: Array<Omit<OrderItemModel, "id" | "category_id" | "created_at">>;
};

enum OrdersQueries {
  GET_ORDERS_AND_ORDER_ITEMS = "SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, oi.id AS order_item_id, oi.product_id, oi.quantity, oi.subtotal FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN users u ON o.user_id = u.id",
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
}

export {
  FilterQueries,
  OrderModel,
  OrderItemModel,
  FormattedOrders,
  OrderStatus,
  OrderPostRequestModel,
  OrdersQueries,
  OrdersWithItems,
  OrdersTableColumns,
  OrderErrorMessage,
};
