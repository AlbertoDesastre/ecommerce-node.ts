import { ConnectionMethods } from "../../src/store/interfaces";
import { handleConnection } from "../../src/store/mysql";
import { ProductService } from "../../src/components/products/services";
import { Product } from "../../src/components/products/interfaces";

const fakeProducts = [
  {
    id: 11,
    category_id: 3,
    name: "Nintendo Switch",
    description: "Versatile gaming console for both handheld and TV gaming.",
    color: "Neon Red/Neon Blue",
    price: 127,
    quantity: 90,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 12,
    category_id: 8,
    name: "Samsung Galaxy Watch 4",
    description:
      "Smartwatch with advanced health and fitness tracking features.",
    color: "Phantom Black",
    price: 127,
    quantity: 50,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 13,
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
    id: 14,
    category_id: 9,
    name: "Fitbit Charge 4",
    description: "Fitness tracker with built-in GPS and heart rate monitoring.",
    color: "Black",
    price: 127,
    quantity: 200,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 15,
    category_id: 10,
    name: "Bose SoundLink Revolve+",
    description: "Portable Bluetooth speaker with 360-degree sound.",
    color: "Lux Gray",
    price: 127,
    quantity: 80,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 16,
    category_id: 11,
    name: "Google Nest Hub",
    description:
      "Smart display with voice control for managing your smart home.",
    color: "Chalk",
    price: 100,
    quantity: 120,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 17,
    category_id: 2,
    name: "Microsoft Surface Pro 7",
    description: "Versatile 2-in-1 laptop and tablet for productivity.",
    color: "Platinum",
    price: 127,
    quantity: 70,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 18,
    category_id: 5,
    name: "GoPro HERO9 Black",
    description:
      "Action camera with 5K video recording and advanced stabilization.",
    color: "Black",
    price: 127,
    quantity: 50,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 19,
    category_id: 11,
    name: "Amazon Echo Dot",
    description:
      "Smart speaker with Alexa voice assistant for hands-free control.",
    color: "Charcoal",
    price: 50,
    quantity: 250,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 20,
    category_id: 5,
    name: "Nikon D850",
    description: "Professional DSLR camera with high-resolution image sensor.",
    color: "Black",
    price: 127,
    quantity: 15,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 21,
    category_id: 6,
    name: "Apple AirPods Pro",
    description: "Premium wireless earbuds with active noise cancellation.",
    color: "White",
    price: 127,
    quantity: 150,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 22,
    category_id: 12,
    name: "Samsung Galaxy Tab S7+",
    description: "High-performance Android tablet with stunning display.",
    color: "Mystic Black",
    price: 127,
    quantity: 40,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 23,
    category_id: 4,
    name: "Sony BRAVIA OLED TV",
    description: "Top-of-the-line OLED TV with impressive picture quality.",
    color: "Black",
    price: 127,
    quantity: 25,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 24,
    category_id: 8,
    name: "Garmin Forerunner 945",
    description: "Advanced GPS smartwatch for runners and triathletes.",
    color: "Black",
    price: 127,
    quantity: 30,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
  {
    id: 25,
    category_id: 6,
    name: "Sony WH-1000XM3",
    description: "Noise-canceling headphones with exceptional sound quality.",
    color: "Silver",
    price: 127,
    quantity: 100,
    image: "",
    active: 1,
    created_at: "2023-07-09T18:57:14.000Z",
  },
];

const mockList = jest.fn();

/* This seems like a pretty good aproximation for testing Connections that require from a function that
returns a lot of other functions. The reason why it wasn't working is because in line XX I'm trying to call
"handleConnection()". If I don't mock that specific function with that specific name, when searching for
handleConnection it will find nothing, even If I mock up correctly it's returning functions.*/
jest.mock("../../src/store/mysql", () => ({
  handleConnection: () => ({
    list: mockList,
    getOne: () => null,
  }),
}));

describe("*TEST* --> PRODUCTS__Service", () => {
  let connection: ConnectionMethods;
  let productService: ProductService;

  beforeAll(() => {
    connection = handleConnection();
    productService = new ProductService();
    /* This is specially useful when you want unaltered data for each test.
    For example, If I wanted to sum "b = 2 + a" in test A, and I wanted to divide in Test B
    "c = 2 / b" , the "b" will have the value modified by previous test.*/
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
