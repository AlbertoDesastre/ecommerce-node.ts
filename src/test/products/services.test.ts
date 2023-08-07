const mockHandleConnection = jest.fn();
const mockSqlList = jest.fn();
const mockSqlGetOne = jest.fn();

import { ProductService } from "../../components/products/services";
import { Product } from "../../components/products/interfaces";
import { fakeProducts } from "./assets";

jest.mock("../../store/mysql", () => {
  return {
    handleConnection: mockHandleConnection.mockReturnValue({
      list: mockSqlList,
      getOne: mockSqlGetOne,
    }),
  };
});

describe("test for Products Service", () => {
  let productService: ProductService;
  let productListSpy: jest.SpyInstance;

  beforeAll(() => {
    productService = new ProductService();
    productListSpy = jest.spyOn(productService, "list");
  });

  beforeEach(() => {
    /* This is specially useful when you want unaltered data for each test.  For example, If I wanted to sum "b = 2 + a" in test A, and I wanted to divide in Test B  "c = 2 / b" , the "b" will have the value modified by previous test.*/
    jest.clearAllMocks();
  });

  describe("products calling [LIST]", () => {
    test("should receive 'limit=15' and 'offset=0' when it's undefined from controller", async () => {
      productService.list({});

      expect(productListSpy).toHaveBeenCalledWith({});
      expect(productListSpy).toHaveBeenCalledTimes(1);

      /* remember that mockList is the mocked version of the mysqlStore, not the "list" method of productsService */
      expect(mockSqlList).toHaveBeenCalledTimes(1);
      expect(mockSqlList).toHaveBeenCalledWith({
        limit: "15",
        offset: "0",
        table: "products",
      });
    });

    test("should send both 'limit' and 'offset' even when one of them it's missing", async () => {
      await productService.list({ limit: "4" });
      expect(mockSqlList).toHaveBeenCalledWith({
        table: "products",
        limit: "4",
        offset: "0",
      });
      expect(productListSpy).toHaveBeenCalledTimes(1);

      await productService.list({ offset: "33" });
      expect(mockSqlList).toHaveBeenCalledWith({
        table: "products",
        limit: "15",
        offset: "33",
      });
      expect(productListSpy).toHaveBeenCalledTimes(2);
    });

    test("should receive a list of 15 products", async () => {
      mockSqlList.mockReturnValue(fakeProducts);
      const products = (await productService.list({})) as Product[];

      expect(productListSpy).toHaveBeenCalledTimes(1);
      expect(products.length).toBe(15);

      expect(mockSqlList).toHaveBeenCalled();
      expect(mockSqlList).toHaveBeenCalledTimes(1);
      expect(mockSqlList).toHaveBeenCalledWith({
        limit: "15",
        offset: "0",
        table: "products",
      });
    });

    test("should receive a specific product, in position 0", async () => {
      mockSqlList.mockReturnValue([
        {
          id: 11,
          category_id: 3,
          name: "Nintendo Switch",
          description:
            "Versatile gaming console for both handheld and TV gaming.",
          color: "Neon Red/Neon Blue",
          price: 127,
          quantity: 90,
          image: "",
          active: 1,
          created_at: "2023-07-09T18:57:14.000Z",
        },
      ]);
      const products = (await productService.list({})) as Product[];
      expect(products[0].name).toEqual("Nintendo Switch");
    });
  });
});
