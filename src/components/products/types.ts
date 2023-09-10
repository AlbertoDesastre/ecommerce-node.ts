type FilterQueries = {
  name?: string;
  price?: string;
  color?: string;
};

enum ErrorThrower {
  PRODUCT_NOT_FOUND = "No product was found",
  PRODUCT_COULDNT_UPDATE = "The product that you are trying to update doesn't exists.",
  PRODUCT_REMAIN_THE_SAME = "No update was made to the product because it has the same state.",
}

export { FilterQueries, ErrorThrower };
