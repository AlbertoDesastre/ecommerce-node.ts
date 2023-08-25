import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { handleConnection } from "../../store/mysql";
import { TableColumns } from "../../store/types";
import { BasicUser, User, UserUpdateObject } from "./types";
import { AuthService } from "../auth/services";

const authService = new AuthService();
const connection = handleConnection();

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */
const get = () => {};

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
    tableColumns: TableColumns.USERS,
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

  const token = authService.createToken({ username, email, password });
  //pending MAYBE to update token in the database. Check...

  return token;
};

const update = async ({
  id,
  username,
  email,
  password,
  avatar,
}: UserUpdateObject) => {
  const response = await connection.update({
    table: "users",
    item: { username, email, password, avatar },
    id: id,
  });

  console.log(response);

  return response;
};

const eliminate = () => {};

export { get, register, login, update, eliminate };
