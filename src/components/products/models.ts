interface FilterQueries {
  name?: string;
  price?: string;
  color?: string;
}

interface Product {
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
}

export { FilterQueries, Product };
