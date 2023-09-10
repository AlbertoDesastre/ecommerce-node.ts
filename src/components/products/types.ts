type FilterQueries = {
  name?: string;
  price?: string;
  color?: string;
};

enum ErrorThrower {
  PRODUCT_NOT_FOUND = "No product was found",
  PRODUCT_COULDNT_UPDATE = "The product that you are trying to update doesn't exists.",
}

export { FilterQueries, ErrorThrower };
