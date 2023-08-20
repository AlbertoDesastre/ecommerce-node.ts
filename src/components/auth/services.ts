require("dotenv").config();
import { MysqlError } from "mysql";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { handleConnection } from "../../store/mysql";
import { MysqlQueryResult, TableColumns } from "../../store/types";
import { User, BasicUser } from "../user/types";

class AuthService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }

  createToken({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): string {
    try {
      const token = jwt.sign(
        { username, password },
        process.env.SECRET as string
      );

      return token;
    } catch (error) {
      console.error(error);
      throw new Error("Error during token creation");
    }
  }

  encryptPassword({ password }: { password: string }) {
    const hashedPassword = bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        return hashedPassword;
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Error ocurred hashing the password");
      });

    return hashedPassword;
  }

  async register({ username, email, password }: BasicUser) {
    const token = this.createToken({ username, password });
    const hashedPassword = await this.encryptPassword({ password });

    let userInformation: User = {
      id: nanoid(),
      username,
      email,
      password: hashedPassword,
      avatar: null,
      token,
      created_at: new Date(),
    };

    const response = await this.connection.create({
      table: "users",
      tableColumns: TableColumns.USERS,
      arrayOfData: [Object.values(userInformation)],
    });

    return response;
  }

  async checkUserToken() {}

  async eliminateUser() {}
}

export { AuthService };
