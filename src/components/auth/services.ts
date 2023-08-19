import { MysqlError } from "mysql";

import { handleConnection } from "../../store/mysql";
import { MysqlQueryResult } from "../../store/types";

class AuthService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }
  async register({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    return [{ username, password }];
  }

  async checkUserToken() {}

  async eliminateUser() {}
}

export { AuthService };
