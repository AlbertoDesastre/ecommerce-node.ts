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

enum TableColumns {
  PRODUCTS_POST_VALUES = "(category_id, name, description, price, quantity, image)",
  PRODUCTS_GET_VALUES = "category_id, name, color, description, price, quantity, image",
}
export { Product, TableColumns };
