type FilterQueries = {
  name?: string;
  price?: string;
  color?: string;
};

type Order = any;

type ProductsTableColumns =
  "(category_id, name, description, price, quantity, image)";

export { FilterQueries, Order, ProductsTableColumns };
