import { ConnectionMethods } from "../../src/store/interfaces";
import { handleConnection } from "../../src/store/mysql";
import { ProductService } from "../../src/components/products/services";
import { Product } from "../../src/components/products/interfaces";

describe("*TEST* --> PRODUCTS__Service", () => {
  let connection: ConnectionMethods;
  let productService: ProductService;
  beforeAll(() => {
    connection = handleConnection();
    productService = new ProductService();
  });

  test("should receive a list of 15 products", async () => {
    const products = (await productService.list({})) as Product[];

    expect(products.length).toBe(15);
  });
});
