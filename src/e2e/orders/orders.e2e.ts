import request from "supertest";
import { Express } from "express";
import http from "http";
import { format } from "date-fns";

import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import { app } from "../../app";
import { TableColumns as CategoryTableColumns } from "../../components/product_categories/models";
import { TableColumns as ProductTableColumns } from "../../components/products/models";
import { TableColumns as UserTableColumns } from "../../components/user/models";
import { TableColumns as OrderTableColumns } from "../../components/orders/models";

import {
  productCategoriesReadyToCreate,
  productsReadyToCreate,
  orderItemsReadyToCreate,
  ordersReadyToCreate,
  productsReadyToCreateWithIds,
} from "../exampleData";

describe("Test for *ORDERS* --> CONTROLLER", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;
  // variables used for doing tests down there
  let usersId: any;
  let productId: any;

  /*   const expectedOrderShape = {
    id: expect.any(Number),
    user_id: expect.any(String),
    total_amount: expect.any(Number),
    status: expect.any(String),
    modified_at: expect.any(String),
    created_at: expect.any(String),
  };
 */
  const expectedOrderWithItemsShape = {
    created_at: expect.any(String),
    id: expect.any(Number),
    products: expect.arrayContaining([
      expect.objectContaining({
        color: expect.any(String),
        name: expect.any(String),
        order_item_id: expect.any(Number),
        quantity: expect.any(Number),
        subtotal: expect.any(Number),
      }),
    ]),
    status: expect.any(String),
    total_amount: expect.any(Number),
    user_id: expect.any(String),
  };

  const userInfo = [
    "user_id_1234",
    "test",
    "test@mail.com",
    "password123",
    "",
    "2023-05-05",
  ];

  const userWithoutOrdersInfo = [
    "user_orderless",
    "orderless",
    "orderless@mail.com",
    "password123",
    "",
    "2023-05-05",
  ];

  beforeAll(async () => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();

    // respect the order of execution for the following queries!!

    // I create the categories in order to create all the products necessary
    await connection.create({
      table: "categories",
      tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
      arrayOfData: productCategoriesReadyToCreate,
    });
    // Important! This array has a length of 19!
    await connection.create({
      table: "products",
      tableColumns: ProductTableColumns.PRODUCTS_POST_VALUES_WITH_IDS_FOR_TEST,
      arrayOfData: productsReadyToCreateWithIds,
    });
    await connection.create({
      table: "users",
      tableColumns: UserTableColumns.USERS_POST_VALUES,
      arrayOfData: [userInfo, userWithoutOrdersInfo],
    });
    await connection.create({
      table: "orders",
      tableColumns: "(user_id, total_amount, id)",
      arrayOfData: ordersReadyToCreate,
    });
    await connection.create({
      table: "order_items",
      tableColumns: OrderTableColumns.ORDER_ITEMS_POST_VALUES,
      arrayOfData: orderItemsReadyToCreate,
    });

    usersId = {
      normalUser: "user_id_1234",
      orderlessUser: "user_orderless",
    };
    // console.log(await connection.personalizedQuery(`SELECT * FROM orders`));
  });

  afterAll(async () => {
    await connection.eliminate({ table: "order_items" });
    await connection.eliminate({ table: "orders" });
    await connection.eliminate({ table: "products" });
    await connection.eliminate({ table: "categories" });
    await connection.eliminate({ table: "users" });
    server.close();
  });

  describe("test for [GET] (/api/v1/orders/:orderId -- GET) ", () => {
    test("should return and order, if order_id exists", async () => {
      //Act
      return await request(app)
        .get("/api/v1/orders/1")
        .expect(200)
        .then((res: request.Response) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "This order is available",
            // this belongs to the very first order on 'ordersReadyToCreate' array
            body: [
              {
                created_at: expect.any(String),
                id: 1,
                modified_at: expect.any(String),
                status: "payment_pending",
                total_amount: 500,
                user_id: "user_id_1234",
              },
            ],
          });
        });
    });

    test("should throw error 404 if no order was not found", async () => {
      await request(app)
        .get(`/api/v1/orders/9217590`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "No order was found",
          });
        });
    });
  });

  describe("test for [LIST] (/api/v1/orders/ -- GET) ", () => {
    test("should throw error 404 if the user searched doesn't exists", async () => {
      await request(app)
        .get(`/api/v1/orders/?userId=1290r1hngi34`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "This consumer doesn't exists and therefore it doesn't have any orders.",
          });
        });
    });

    test("should throw status 200 if the user exist but doesn't have any orders", async () => {
      await request(app)
        .get(`/api/v1/orders/?userId=${usersId.orderlessUser}`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Succesfull call, here are the results.",
            body: "This user doesn't have any orders.",
          });
        });
    });

    test("should return status 200 and order, if order_id exists", async () => {
      return await request(app)
        .get(`/api/v1/orders/?userId=${usersId.normalUser}`)
        .expect(200)
        .then((res: request.Response) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Succesfull call, here are the results.",
            // this belongs to the very first order on 'ordersReadyToCreate' array
            body: expect.arrayContaining([
              expect.objectContaining(expectedOrderWithItemsShape),
            ]),
          });

          expect(JSON.parse(res.text).body.length).toBeGreaterThan(1);
        });
    });
  });

  describe("test for [FILTER] (/api/v1/orders/filter -- GET) ", () => {
    test("should throw 404 if no order contains the product with certain NAME", async () => {
      await request(app)
        .get(`/api/v1/orders/filter?productName=NGEWNGWLÑÑL34`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "There are no orders with the name or creation date specified.",
          });
        });
    });

    test("should throw 400 there are no query params for this call", async () => {
      await request(app)
        .get(`/api/v1/orders/filter?creationDate=2002-05-05`)
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "You must provide either 'productName' or 'itemCreatedAt' properties in query params to perform this action.",
          });
        });
    });

    test("should throw 400 if 'itemCreatedAt' has wrong format", async () => {
      await request(app)
        .get(`/api/v1/orders/filter?itemCreatedAt=2000/05/05`)
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "Invalid date format. Please use the format 'YYYY-MM-DD'.",
          });
        });
    });

    test("should throw 404 if no order contains the product with certain ITEM CREATED AT", async () => {
      await request(app)
        .get(`/api/v1/orders/filter?itemCreatedAt=2002-05-05`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "There are no orders with the name or creation date specified.",
          });
        });
    });

    test("should bring status 200 and an iPhone order if the product exists in an order", async () => {
      await request(app)
        .get(`/api/v1/orders/filter?productName=${productsReadyToCreate[0][0]}`) // this corresponds to "iPhone 13 Pro"
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Order/s available...",
            body: expect.arrayContaining([
              expect.objectContaining(expectedOrderWithItemsShape),
            ]),
          });

          expect(JSON.parse(res.text).body.length).toEqual(1);
          expect(JSON.parse(res.text).body[0].products[0].name).toEqual(
            "iPhone 13 Pro"
          );
        });
    });

    test("should bring status 200 and some orders if ITEM CREATED AT match with the products", async () => {
      const today = format(new Date(), "yyyy-MM-dd");

      await request(app)
        .get(`/api/v1/orders/filter?itemCreatedAt=${today}`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Order/s available...",
            body: expect.arrayContaining([
              expect.objectContaining(expectedOrderWithItemsShape),
            ]),
          });

          expect(JSON.parse(res.text).body.length).toBeGreaterThan(3);
        });
    });
  });

  describe("test for [CREATE] (/api/v1/orders/ -- POST) ", () => {
    let productId: any;

    beforeAll(async () => {
      const productIdInArray: any = await connection.personalizedQuery(
        `SELECT id FROM products WHERE name = '${productsReadyToCreate[0][0]}'`
      );

      productId = productIdInArray[0].id;
    });

    test("should return 400 if user_id is missing", async () => {
      return await request(app)
        .post("/api/v1/orders/")
        .send({
          total_amount: 100,
          products: [],
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "An user id and the total amount of the order is needed to create it.",
          });
        });
    });

    test("should return 400 if total_amount is missing", async () => {
      return await request(app)
        .post("/api/v1/orders/")
        .send({
          user_id: "user123",
          products: [],
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "An user id and the total amount of the order is needed to create it.",
          });
        });
    });

    test("should return 400 if products array is empty", async () => {
      return await request(app)
        .post("/api/v1/orders/")
        .send({
          user_id: "user123",
          total_amount: 100,
          products: [],
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "There must be at least one product to create an order.",
          });
        });
    });

    test("should return 400 if the products doesn't match the model required", async () => {
      const orderToCreate = {
        user_id: userInfo[0],
        total_amount: 100,
        products: [
          {
            order_id: null,
            name: "Product 1",
            price: 50,
            quantity: 100,
          },
          {
            order_id: null,
            name: "Product 2",
            subtotal: null,
          },
        ],
      };

      return await request(app)
        .post("/api/v1/orders/")
        .send(orderToCreate)
        .expect(400)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "One of the properties you've passed in products array doesn't match the required model",
          });
        });
    });

    test("should return 500 if user provided for this order doesn't exists", async () => {
      const orderToCreate = {
        user_id: "super-mega-fake-user-id",
        total_amount: 100,
        products: [
          {
            order_id: null,
            product_id: productId,
            quantity: 50,
            subtotal: 300,
          },
          {
            order_id: null,
            product_id: productId,
            quantity: 40,
            subtotal: 24,
          },
        ],
      };

      return await request(app)
        .post("/api/v1/orders/")
        .send(orderToCreate)
        .expect(500)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toMatchObject({
            error: true,
            status: 500,
            body: "You can't create an order to an user that doesn't exists.",
          });
        });
    });

    test("should return 201 if order fulfills all the criteriah to be created", async () => {
      const orderToCreate = {
        user_id: usersId.normalUser,
        total_amount: 100,
        products: [
          {
            order_id: null,
            product_id: productId,
            quantity: 50,
            subtotal: 300,
          },
          {
            order_id: null,
            product_id: productId,
            quantity: 40,
            subtotal: 24,
          },
        ],
      };

      return await request(app)
        .post("/api/v1/orders/")
        .send(orderToCreate)
        .expect(201)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toMatchObject({
            error: false,
            status: 201,
            message: "Order created",
          });
        });
    });
  });
});
