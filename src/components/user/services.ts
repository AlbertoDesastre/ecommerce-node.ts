import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

import { handleConnection } from "../../store/mysql";
import { BasicUser, User, TableColumns } from "./models";
import { AuthService } from "../auth/services";
import { ErrorThrower } from "./types";
import {
  ErrorThrower as MysqlErrorThrower,
  SuccessfulQueryMessage,
} from "../../store/types";

const authService = new AuthService();
const connection = handleConnection();

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */
const get = async ({ id }: { id: string }) => {
  const result = await connection.getOne({
    table: "users",
    tableColumns: TableColumns.USERS_GET_PARTIAL_VALUES,
    id,
    addExtraQuotesToId: true,
  });

  if (Array.isArray(result) && result.length === 0) {
    throw new Error(ErrorThrower.USER_DOESNT_EXISTS);
  }

  return result as User[];
};

const register = async ({ username, email, password }: BasicUser) => {
  const hashedPassword = await authService.encryptPassword({ password });

  let userInformation: User = {
    id: nanoid(),
    username,
    email,
    password: hashedPassword,
    avatar: null,
    created_at: new Date(),
  };

  const result = await connection.create({
    table: "users",
    tableColumns: TableColumns.USERS_POST_VALUES,
    arrayOfData: [Object.values(userInformation)],
  });

  return result;
};

const login = async ({ username, email, password }: BasicUser) => {
  //note: if you pass both username and email, and username is correct but email doesn't, it will still login.
  // this could be worrying, but the use case for this is to only send one of this atributes. Test it out on a later time

  const result = await connection.login({
    table: "users",
    username,
    email,
  });

  if (result === undefined) {
    throw new Error(ErrorThrower.USER_DOESNT_EXISTS);
  }

  const passwordMatch = await bcrypt.compare(password, result.password);

  if (!passwordMatch) {
    throw new Error(ErrorThrower.PASSWORD_NOT_MATCHING);
  }

  const token = authService.createToken({
    id: result.id,
    username,
    email,
    password,
  });
  //pending MAYBE to update token in the database. Check...

  return token;
};

const update = async ({ id, username, email, password, avatar }: User) => {
  const userOnDb = await connection.getOne({
    table: "users",
    tableColumns: TableColumns.USERS_GET_VALUES,
    id,
    addExtraQuotesToId: true,
  });

  if (Array.isArray(userOnDb) && userOnDb.length === 0) {
    throw new Error(ErrorThrower.USER_UPDATING_DOESNT_EXISTS);
  }

  const hashedPassword = await authService.encryptPassword({ password });

  const result = await connection.update({
    table: "users",
    item: { username, email, password: hashedPassword, avatar },
    id: id,
  });

  if (result.message === MysqlErrorThrower.ITEM_WASNT_FOUND)
    throw new Error(ErrorThrower.USER_UPDATING_DOESNT_EXISTS);

  /* In this case, this error will never happend because the password gets encrypted differently every time, even if it's the same.
   For that reason, it will always get updated as it has "new" information.
   if (result.message === MysqlErrorThrower.NO_UPDATE_WAS_MADE)
    throw new Error(ErrorThrower.USER_REMAIN_THE_SAME); */

  return result;
};

const eliminate = async ({ id }: { id: string }) => {
  // pending to add here the methods to delete orders + order items, coming from their respective services

  const result = await connection.eliminate({
    table: "users",
    id,
    addExtraQuotesToId: true,
  });

  if (result instanceof Error) {
    throw new Error(result.message);
  }

  return SuccessfulQueryMessage.ALL_INFO_WAS_DELETE;
};

export { get, register, login, update, eliminate };
