import { MysqlError } from "mysql";

import { handleConnection } from "../../store/mysql";
import { MysqlQueryResult } from "../../store/types";

class AuthService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }
  async register({ user, password }: { user: string; password: string }) {}

  async checkUserToken() {}

  async eliminateUser() {}
}

export { AuthService };
