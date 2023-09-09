import { MysqlError } from "mysql";
import { User } from "../components/user/types";

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
interface GetOneParams extends Params {
  tableColumns: string;
  id: string | number;
  addExtraQuotesToId: boolean;
}
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

type RowDataPacketName = "RowDataPacket";

type RowDataPacketArray = Array<Record<RowDataPacketName, Object>>;

type RowDataPacket = Record<RowDataPacketName, Object>;

type ConnectionMethods = {
  getOne: ({
    table,
    tableColumns,
    id,
    addExtraQuotesToId,
  }: GetOneParams) => Promise<Object[] | MysqlError>;
  login: ({ table, username, email }: LoginParams) => Promise<User | undefined>;
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
  personalizedQuery: (query: string) => Promise<Object[] | MysqlError>;
  closeConnection: () => void;
};

enum GeneralUseTableColumns {
  USERS_POST_VALUES = "(id, username, email, password, avatar, created_at)",
  USERS_GET_ID = "username",
  USERS_GET_PARTIAL_VALUES = "username, email, password, avatar",
  USERS_GET_VALUES = "id, username, email, password, avatar, created_at",
  PRODUCTS_POST_VALUES = "(category_id, name, description, price, quantity, image)",
  PRODUCTS_GET_VALUES = "category_id, name, description, price, quantity, image",
  CATEGORIES_POST_VALUES = "(name, description, active)",
  CATEGORIES_GET_VALUES = "id, name, description, created_at",
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
  GeneralUseTableColumns,
  RowDataPacket,
  RowDataPacketArray,
};
