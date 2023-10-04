import request from "supertest";
import { Express } from "express";
import http from "http";

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
import { ErrorThrower } from "../../components/products/types";

describe("Test for *ORDERS* --> CONTROLLER", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;
  // variables used for doing tests down there
  let userId: any;
  let productId: any;

  const expectedOrderShape = {
    id: expect.any(Number),
    user_id: expect.any(String),
    total_amount: expect.any(Number),
    status: expect.any(String),
    modified_at: expect.any(String),
    created_at: expect.any(String),
  };

  const userInfo = [
    "user_id_1234",
    "test",
    "test@mail.com",
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
      arrayOfData: [userInfo],
    });
    const userIdInArray: any = await connection.personalizedQuery(
      `SELECT id FROM users WHERE username = '${userInfo[1]}'`
    );

    userId = userIdInArray[0].id;

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

  describe("test for [GET] (/api/v1/orders/:ordertId -- GET) ", () => {
    let productId: any;

    // Arrange
    beforeAll(async () => {
      // Notice a product of the sample array looks like this:
      // [1, "iPhone 13 Pro", "The latest flagship smartphone from Apple.", 1099.99, 50, 1, "Space Gray"
      productId = await connection.personalizedQuery(
        `SELECT id FROM products WHERE name = '${productsReadyToCreateWithIds[0][1]}'`
      );
    });

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
        .get(`/api/v1/orders/1290r1hngi34`)
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
        user_id: userId,
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