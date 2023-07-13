interface ListParams {
  table: string;
  limit: string;
  offset: string;
}

interface FilterByParams {
  table: string;
  conditions: string;
  filters: string[];
}

export { FilterByParams, ListParams };
