const mockHandleConnection = jest.fn();
const mockSqlGetOne = jest.fn();
const mockSqlList = jest.fn();
const mockSqlFilterBy = jest.fn();
const mockSqlCreate = jest.fn();
const mockSqlUpdate = jest.fn();
const mockSqlToggleItemStatus = jest.fn();
const mockSqlEliminate = jest.fn();

jest.mock("../../store/mysql", () => {
  return {
    handleConnection: mockHandleConnection.mockReturnValue({
      getOne: mockSqlGetOne,
      list: mockSqlList,
      filterBy: mockSqlFilterBy,
      create: mockSqlCreate,
      update: mockSqlUpdate,
      toggleItemStatus: mockSqlToggleItemStatus,
      eliminate: mockSqlEliminate,
    }),
  };
});

import { ProductService } from "../../components/products/services";
import { Product } from "../../components/products/types";
import { fakeProducts } from "./assets";

describe("test for Products Service", () => {
  let productService: ProductService;

  beforeAll(() => {
    productService = new ProductService();
  });

  beforeEach(() => {
    /* This is specially useful when you want unaltered data for each test.  For example, If I wanted to sum "b = 2 + a" in test A, and I wanted to divide in Test B  "c = 2 / b" , the "b" will have the value modified by previous test.*/
    jest.clearAllMocks();
  });

  describe("products calling [list]", () => {
    let productListSpy: jest.SpyInstance;

    beforeAll(() => {
      productListSpy = jest.spyOn(productService, "list");
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

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

  describe("products calling [filterBy]", () => {
    let productFilterBySpy: jest.SpyInstance;

    beforeAll(() => {
      productFilterBySpy = jest.spyOn(productService, "filterBy");
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should receive all given parameters ", () => {
      productService.filterBy({});
      expect(productFilterBySpy).toBeCalledWith({});
      expect(mockSqlFilterBy).toBeCalledTimes(1);
      expect(mockSqlFilterBy).toBeCalledWith({
        table: "products",
        conditions: "",
        filters: [],
      });

      productService.filterBy({
        name: "nintendo",
        color: "black",
      });
      expect(productFilterBySpy).toBeCalledWith({
        name: "nintendo",
        price: undefined,
        color: "black",
      });
      expect(mockSqlFilterBy).toBeCalledWith({
        table: "products",
        conditions: "name LIKE ? AND color LIKE ?",
        filters: ["%nintendo%", "%black%"],
      });

      productService.filterBy({
        price: "2000",
      });
      expect(productFilterBySpy).toBeCalledWith({
        price: "2000",
      });
      expect(mockSqlFilterBy).toBeCalledWith({
        table: "products",
        conditions: "price <= ?",
        filters: ["2000"],
      });
    });

    test("should give mySqlStore the correct parameters when all atributes are filled", () => {
      productService.filterBy({
        name: "nintendo",
        price: "2000",
        color: "black",
      });
      expect(productFilterBySpy).toBeCalledWith({
        name: "nintendo",
        price: "2000",
        color: "black",
      });
      expect(mockSqlFilterBy).toBeCalledWith({
        table: "products",
        conditions: "name LIKE ? AND price <= ? AND color LIKE ?",
        filters: ["%nintendo%", "2000", "%black%"],
      });
    });
  });

  describe("products calling [create]", () => {
    let productCreateSpy: jest.SpyInstance;

    beforeAll(() => {
      productCreateSpy = jest.spyOn(productService, "create");
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("should send the values of the array that's coming from controller", () => {
      productService.create([
        {
          id: 3,
          category_id: 4,
          name: "LG OLED 4K TV",
          description: "Premium OLED TV with deep blacks and rich colors.",
          color: "Ceramic Black",
          price: 127,
          quantity: 30,
          image: "",
          active: 1,
          created_at: "2023-07-09T18:57:14.000Z",
        },
        {
          id: 4,
          category_id: 9,
          name: "Fitbit Charge 4",
          description:
            "Fitness tracker with built-in GPS and heart rate monitoring.",
          color: "Black",
          price: 127,
          quantity: 200,
          image: "",
          active: 1,
          created_at: "2023-07-09T18:57:14.000Z",
        },
      ]);

      expect(mockSqlCreate).toHaveBeenCalledWith({
        table: "products",
        arrayOfData: [
          [
            3,
            4,
            "LG OLED 4K TV",
            "Premium OLED TV with deep blacks and rich colors.",
            "Ceramic Black",
            127,
            30,
            "",
            1,
            "2023-07-09T18:57:14.000Z",
          ],
          [
            4,
            9,
            "Fitbit Charge 4",
            "Fitness tracker with built-in GPS and heart rate monitoring.",
            "Black",
            127,
            200,
            "",
            1,
            "2023-07-09T18:57:14.000Z",
          ],
        ],
      });
    });
  });
});
