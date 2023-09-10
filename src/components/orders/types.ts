type FilterQueries = {
  productName?: string;
  itemCreatedAt?: string;
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

enum ErrorThrower {
  ORDER_NOT_FOUND = "No order was found",
  USER_DOESNT_HAVE_ORDERS = "This user doesn't have any orders.",
  USER_DOESNT_EXISTS = "This consumer doesn't exists and therefore it doesn't have any orders.",
  ORDER_ITEM_DOESNT_EXISTS_WITH_THESE_PARAMS = "There are no orders with the name or creation date specified.",
  ORDER_NOT_CREATED_NON_EXISTING_USER = "You can't create an order to an user that doesn't exists.",
  ORDER_FAILED_CREATION = "Failed to create the order.",
  SOMETHING_WRONG_OCURRED = "Something wrong ocurred when creating the order's item/s.",
}

export {
  FilterQueries,
  FormattedOrders,
  OrderWithItems,
  OrderWithProductsInfo,
  ErrorThrower,
};
