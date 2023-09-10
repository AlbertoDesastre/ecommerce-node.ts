require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { BasicUserWithId } from "../user/models";

class AuthService {
  createToken({ id, username, email, password }: BasicUserWithId): string {
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
    try {
      const result = jwt.verify(token, process.env.SECRET as string);
      return result;
    } catch (error) {
      return new Error("Something wrong ocurred when verifying token.");
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
}

export { AuthService };
