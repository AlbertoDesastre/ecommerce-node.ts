type FilterQueries = {
  name: string;
};

enum ErrorThrower {
  CATEGORY_NOT_FOUND = "The category you are searching for doesn't exists.",
  CATEGORY_REMAIN_THE_SAME = "No update was made to the category because it has the same state.",
}

export { FilterQueries, ErrorThrower };
