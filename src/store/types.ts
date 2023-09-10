import { MysqlError } from "mysql";
import { User } from "../components/user/models";

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

enum ErrorThrower {
  ITEM_WASNT_FOUND = "(Rows matched: 0  Changed: 0  Warnings: 0",
  NO_UPDATE_WAS_MADE = "(Rows matched: 1  Changed: 0  Warnings: 0",
  USER_DUPLICATED = "User already exists",
  TRYING_TO_INSERT_NON_EXISTING_FOREIGN_KEY = "You are trying to create something based on a non-existing foreign key in other table.",
}

enum SuccessfulQueryMessage {
  ITEM_WAS_UPDATED = "The item you wanted to update was indeed updated.",
  ITEM_WERE_CREATED = "Every item/s provided were created.",
}

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
  RowDataPacket,
  RowDataPacketArray,
  ErrorThrower,
  SuccessfulQueryMessage,
};
