import { ConnectionMethods } from "../../src/store/interfaces";
import { handleConnection } from "../../src/store/mysql";

describe("*TEST* --> PRODUCTS__Service", () => {
  let connection: ConnectionMethods;
  beforeAll(() => {
    connection = handleConnection();
  });

  test("should receive a list of products", async () => {
    const products = connection;
  });
});
