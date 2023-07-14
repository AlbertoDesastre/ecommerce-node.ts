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

interface CreateParams {
  table: string;
  arrayOfData: Array<Array<string>>;
}

interface UpdateParams {
  table: string;
  item: Object;
  id: string;
}

// Including type equals to X and "Omit" and "Pick" keywords as practice material
type GetOneParams = Omit<UpdateParams, "item">;

type DeleteParams = Pick<UpdateParams, "table" | "id">;

interface ToggleItemStatus {
  table: string;
  boolean: "TRUE" | "FALSE";
  id: string;
}

export {
  FilterByParams,
  ListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  ToggleItemStatus,
};