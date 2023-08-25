require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { handleConnection } from "../../store/mysql";
import { BasicUser, UserWithId } from "../user/types";

class AuthService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }

  createToken({ id, username, email, password }: UserWithId): string {
    try {
      const token = jwt.sign(
        { id, username, email, password },
        process.env.SECRET as string
      );

      return token;
    } catch (error) {
      console.error(error);
      throw new Error("Error during token creation");
    }
  }

  verifyToken(token: string) {
    return jwt.verify(token, process.env.SECRET as string);
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

  async eliminateUser() {}
}

export { AuthService };
