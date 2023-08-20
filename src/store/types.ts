import { MysqlError } from "mysql";

type Params = {
  table: string;
};

interface ListParams extends Params {
  limit: string;
  offset: string;
}

interface FilterByParams extends Params {
  conditions: string;
  filters: string[];
}

interface CreateParams extends Params {
  tableColumns: string;
  arrayOfData: Array<Array<string | number>>;
}

interface UpdateParams extends Params {
  item: Object;
  id: string;
}

interface LoginParams extends Params {
  username?: string;
  email?: string;
}
// Including type equals to X and "Omit" and "Pick" keywords as practice material
type GetOneParams = Omit<UpdateParams, "item">;

/* type DeleteParams = Pick<UpdateParams, "table" | "id">; */
interface DeleteParams extends Params {
  id?: string;
}

interface ToggleItemStatus extends Params {
  boolean: "TRUE" | "FALSE";
  id: string;
}

type MysqlQueryResult = {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
};

type ConnectionMethods = {
  getOne: ({ table, id }: GetOneParams) => Promise<Object[] | MysqlError>;
  login: ({
    table,
    username,
    email,
  }: LoginParams) => Promise<Object[] | MysqlError>;
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
};

enum TableColumns {
  PRODUCTS = "(category_id, name, description, price, quantity, image)",
  USERS = "(id, username, email, password, avatar, created_at)",
}

export {
  FilterByParams,
  ListParams,
  GetOneParams,
  LoginParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  ToggleItemStatus,
  MysqlQueryResult,
  ConnectionMethods,
  TableColumns,
};
