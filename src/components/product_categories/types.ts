type FilterQueries = {
  name: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
  active: 1 | 0;
  created_at: string;
};

type CategoryTableColumns = "(id, name, description)";

export { FilterQueries, Category, CategoryTableColumns };
