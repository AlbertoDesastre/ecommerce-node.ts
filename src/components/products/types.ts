type FilterQueries = {
  name?: string;
  price?: string;
  color?: string;
};

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

type ProductsTableColumns =
  "(category_id, name, description, price, quantity, image)";

export { FilterQueries, Product, ProductsTableColumns };
