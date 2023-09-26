type Category = {
  id: number;
  name: string;
  description: string;
  active: 0 | 1;
  created_at: string;
};

enum TableColumns {
  CATEGORIES_POST_VALUES = "(name, description, active)",
  CATEGORIES_POST_VALUES_WITH_ID = "(id, name, description, active)",
  CATEGORIES_GET_VALUES = "id, name, description, created_at",
}
export { Category, TableColumns };
