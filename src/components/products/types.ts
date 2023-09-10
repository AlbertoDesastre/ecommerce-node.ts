type FilterQueries = {
  name?: string;
  price?: string;
  color?: string;
};

enum ErrorThrower {
  PRODUCT_NOT_FOUND = "No product was found",
}

export { FilterQueries, ErrorThrower };
