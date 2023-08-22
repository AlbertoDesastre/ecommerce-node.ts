import { MysqlError } from "mysql";
import { handleConnection } from "../../store/mysql";
import { MysqlQueryResult } from "../../store/types";
import { UserUpdateObject } from "./types";

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */
const get = () => {};

const create = () => {};

const update = async ({
  username,
  email,
  password,
  avatar,
  token,
}: UserUpdateObject) => {
  return console.log("I reached update function on user");
};

const eliminate = () => {};

export { get, create, update, eliminate };
