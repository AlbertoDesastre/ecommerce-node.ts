import { ProductService } from "../../components/products/services";
import { Product } from "../../components/products/models";
import { fakeProducts } from "./assets";

describe("test for Products Service", () => {
  let productService: ProductService;

  beforeAll(() => {
    // productService = new ProductService();
  });

  beforeEach(() => {
    // This is specially useful when you want unaltered data for each test.  For example, If I wanted to sum "b = 2 + a" in test A, and I wanted to divide in Test B  "c = 2 / b" , the "b" will have the value modified by previous test.
    jest.clearAllMocks();
  });

  test("should return nothing", () => {});
  /* describe("products calling [list]", () => {
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
    });

    test("should send both 'limit' and 'offset' even when one of them it's missing", async () => {
      await productService.list({ limit: "4" });

      expect(productListSpy).toHaveBeenCalledTimes(1);
      expect(productListSpy.mock.calls[0][0]).toEqual({ limit: "4" });

      await productService.list({ offset: "33" });

      expect(productListSpy).toHaveBeenCalledTimes(2);
    });

    test("should receive a list of 15 products", async () => {
      const products = (await productService.list({})) as Product[];

      expect(productListSpy).toHaveBeenCalledTimes(1);
      expect(products.length).toBe(15);
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

    test("should receive all given parameters ", async () => {
      await productService.filterBy({});
      expect(productFilterBySpy).toBeCalledWith({});

      await productService.filterBy({
        name: "nintendo",
        color: "black",
      });
      expect(productFilterBySpy).toBeCalledWith({
        name: "nintendo",
        price: undefined,
        color: "black",
      });

      await productService.filterBy({
        price: "2000",
      });
      expect(productFilterBySpy).toBeCalledWith({
        price: "2000",
      });
    });

    test("should give mySqlStore the correct parameters when all atributes are filled", async () => {
      await productService.filterBy({
        name: "nintendo",
        price: "2000",
        color: "black",
      });
      await expect(productFilterBySpy).toBeCalledWith({
        name: "nintendo",
        price: "2000",
        color: "black",
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
    test("should send the values of the array that's coming from controller", async () => {
      await productService.create([
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
    });
  }); */
});
