import { MysqlError } from "mysql";

import { handleConnection } from "../../store/mysql";
import { MysqlQueryResult } from "../../store/interfaces";

class AuthService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }

  async checkUserToken() {}

  async eliminateUser() {}
}

export { AuthService };
