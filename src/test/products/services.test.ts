const mockHandleConnection = jest.fn();
const mockList = jest.fn();
const mockGetOne = jest.fn();

import { ProductService } from "../../components/products/services";
import { Product } from "../../components/products/interfaces";
import { fakeProducts } from "./assets";

jest.mock("../../store/mysql", () => {
  return {
    handleConnection: mockHandleConnection.mockReturnValue({
      list: mockList,
      getOne: mockGetOne,
    }),
  };
});

describe("*TEST* --> PRODUCTS__Service", () => {
  let productService: ProductService;

  beforeAll(() => {
    productService = new ProductService();
    /* This is specially useful when you want unaltered data for each test.  For example, If I wanted to sum "b = 2 + a" in test A, and I wanted to divide in Test B  "c = 2 / b" , the "b" will have the value modified by previous test.*/
    jest.clearAllMocks();
  });

  test("should receive a list of 15 products", async () => {
    mockList.mockReturnValue(fakeProducts);
    const products = (await productService.list({})) as Product[];

    expect(products.length).toBe(15);
    expect(mockList).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledWith({
      limit: "15",
      offset: "0",
      table: "products",
    });
  });

  test("should receive a specific product, in position 0", async () => {
    mockList.mockReturnValue([
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
