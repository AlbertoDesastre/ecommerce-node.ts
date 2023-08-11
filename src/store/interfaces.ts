import { MysqlError } from "mysql";

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
  arrayOfData: Array<Array<string | number>>;
}

interface UpdateParams {
  table: string;
  item: Object;
  id: string;
}

// Including type equals to X and "Omit" and "Pick" keywords as practice material
type GetOneParams = Omit<UpdateParams, "item">;

/* type DeleteParams = Pick<UpdateParams, "table" | "id">; */
interface DeleteParams {
  table: string;
  id?: string;
}

interface ToggleItemStatus {
  table: string;
  boolean: "TRUE" | "FALSE";
  id: string;
}

interface MysqlQueryResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

interface ConnectionMethods {
  getOne: ({ table, id }: GetOneParams) => Promise<Object[] | MysqlError>;
  list: ({
    table,
    limit,
    offset,
  }: ListParams) => Promise<Object[] | MysqlError>;
  filterBy: ({
    table,
    conditions,
    filters,
  }: FilterByParams) => Promise<Object[] | MysqlError>;
  create: ({
    table,
    arrayOfData,
  }: CreateParams) => Promise<MysqlQueryResult | MysqlError>;
  update: ({
    table,
    item,
    id,
  }: UpdateParams) => Promise<MysqlQueryResult | MysqlError>;
  toggleItemStatus: ({
    table,
    boolean,
    id,
  }: ToggleItemStatus) => Promise<MysqlQueryResult | MysqlError>;
  eliminate: ({ table, id }: DeleteParams) => Promise<MysqlQueryResult>;
  closeConnection: () => void;
}

export {
  FilterByParams,
  ListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  ToggleItemStatus,
  MysqlQueryResult,
  ConnectionMethods,
};
