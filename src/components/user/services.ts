import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { handleConnection } from "../../store/mysql";
import { TableColumns } from "../../store/types";
import { BasicUser, User, UserWithId } from "./types";
import { AuthService } from "../auth/services";

const authService = new AuthService();
const connection = handleConnection();

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */
const get = async ({ id }: { id: string }) => {
  const response = await connection.getOne({
    table: "users",
    tableColumns: TableColumns.USERS_GET_PARTIAL_VALUES,
    id,
    addExtraQuotesToId: true,
  });

  return response;
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

  const response = await connection.create({
    table: "users",
    tableColumns: TableColumns.USERS_POST_VALUES,
    arrayOfData: [Object.values(userInformation)],
  });

  return response;
};

const login = async ({ username, email, password }: BasicUser) => {
  //note: if you pass both username and email, and username is correct but email doesn't, it will still login.
  // this could be worrying, but the use case for this is to only send one of this atributes. Test it out on a later time

  const response = await connection.login({
    table: "users",
    username,
    email,
  });

  //tengo que lograr que el error cuando un usuario no exista aparezzca en la response del controlador
  if (response === undefined) {
    throw new Error("This user doesn't exists.");
  }

  const passwordMatch = await bcrypt.compare(password, response.password);

  if (!passwordMatch) {
    throw new Error("Password do not match");
  }

  const token = authService.createToken({
    id: response.id,
    username,
    email,
    password,
  });
  //pending MAYBE to update token in the database. Check...

  return token;
};

const update = async ({ id, username, email, password, avatar }: User) => {
  const hashedPassword = await authService.encryptPassword({ password });

  const response = await connection.update({
    table: "users",
    item: { username, email, password: hashedPassword, avatar },
    id: id,
  });

  return response;
};

const eliminate = () => {};

export { get, register, login, update, eliminate };
