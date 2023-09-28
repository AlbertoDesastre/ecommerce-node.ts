type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  active: 0 | 1;
  created_at: string;
};

enum ProductQueries {
  GET_PRODUCTS = "SELECT category_id, name, color, description, price, quantity, image FROM products",
}

enum TableColumns {
  PRODUCTS_POST_VALUES = "(category_id, name, description, price, quantity, image)",
  PRODUCTS_POST_VALUES_FOR_TEST = "(name, description, price, quantity, category_id, color)",
  PRODUCTS_GET_VALUES = "category_id, name, color, description, price, quantity, image",
}
export { Product, ProductQueries, TableColumns };
