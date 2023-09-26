import request from "supertest";
import { Express } from "express";
import http from "http";

import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import { app } from "../../app";
import { TableColumns } from "../../components/product_categories/models";
import { SuccessfulQueryMessage } from "../../store/types";

import { ProductService } from "../../components/products/services";
import { productCategoriesReadyToCreate } from "../exampleData";
import { ErrorThrower } from "../../components/products/types";

describe("Test for *PRODUCTS* --> CONTROLLER", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;
  let productService = new ProductService();

  beforeAll(async () => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();

    // I create the categories in order to create all the products necessary
    await connection.create({
      table: "categories",
      tableColumns: TableColumns.CATEGORIES_POST_VALUES_WITH_ID,
      arrayOfData: productCategoriesReadyToCreate,
    });

    // console.log(await connection.personalizedQuery(`SELECT * FROM categories`));
  });

  afterEach(async () => {
    await connection.eliminate({ table: "order_items" });
    await connection.eliminate({ table: "orders" });
    await connection.eliminate({ table: "products" });
    server.close();
  });

  afterAll(async () => {
    await connection.eliminate({ table: "categories" });
  });
  /* E2E, PENDING TO ADD THE FOLLOWING...
    Test Case: Limit and Offset at Database Boundaries
    Verify that the function correctly handles cases where "limit" and "offset" values provided are at the boundaries of the database.

    Test Case: Limit and Offset Exceeding Product Quantity
    Ensure that the function properly handles cases where "limit" and "offset" are greater than the total quantity of products.
   */

  describe("test for [GET] /api/v1/products/", () => {
    // Arrange
    beforeEach(async () => {
      const products = await connection.create({
        table: "products",
        tableColumns:
          "(category_id, name, description, price, quantity, image)",
        arrayOfData: [
          [
            1,
            "Nintendo Switch",
            "Versatile gaming console for both handheld and TV gaming.",
            127,
            90,
            "",
          ],
          [
            2,
            "Apple MacBook Pro",
            "Powerful and elegant laptop for professional use.",
            1799,
            45,
            "",
          ],
          [
            3,
            "Sony Alpha 7 III",
            "Full-frame mirrorless camera with high-speed performance.",
            2199,
            30,
            "",
          ],
        ],
      });
      //
      //
    });

    test("should return an array with some products", async () => {
      //Act
      return await request(app)
        .get("/api/v1/products/")
        .expect(200)
        .then((response: request.Response) => {
          const responseBody = JSON.parse(response.text);

          //Assert
          expect(responseBody.body.length).toEqual(3);
        });
    });
  });

  /*   describe('"test for [GET] (/api/v1/products/:userId -- GET) "', () => {
    test("should throw error if user doesn't exists ", async () => {
      // register it's omitted
      const fakeId = "210491dd2mf3@";

      await request(app)
        .get(`/api/v1/products/${fakeId}`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: null,
          });
        });
    });

    test("should get user information if it exists on DB", async () => {
      // await productService.create(product);

      await request(app)
        .get(`/api/v1/products/`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Here is the user's information:",
            body: [
              {
                username: null,
                email: null,
                avatar: null,
              },
            ],
          });
        });
    });
  });

  describe("test for [REGISTER] (/api/v1/products/register -- POST) ", () => {
    // Arrange
    beforeEach(async () => {});
    afterEach(async () => {
      connection.eliminate({ table: "users" });
    });

    test("should return 400 if the attributes are undefined, or are present but are undefined or null", async () => {
      //Act
      return await request(app)
        .post("/api/v1/products/")
        .send({
          username: null,
          email: undefined,
          password: null,
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            body: "Username, email and password must be provided to register an user",
            error: true,
            status: 400,
          });
        });
    });

    test("should create User if all data it's provided", async () => {
      //Act
      return await request(app)
        .post("/api/v1/products/")
        .send({
          username: "eduardo",
          email: "eduardo@mail.com",
          password: "12345",
        })
        .expect(201)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 201,
            message: "User created succesfully",
            body: "Login using your password and user/email",
          });
        });
    });

    test("should throw 'existing user' error if user with the same 'email' or 'username' exists ", async () => {
      // first call registers userTemplate
      await request(app)
        .post("/api/v1/products/")
        .send()
        .expect(201)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 201,
            message: "User created succesfully",
            body: "Login using your password and user/email",
          });
        });
      // second call registers the same userTemplate
      return await request(app)
        .post("/api/v1/products/")
        .send()
        .expect(409)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 409,
            body: null,
          });
        });
    });
  });

  describe("test for [UPDATE] (/api/v1/products/:id -- PUT)", () => {
    let user;
    let token: string;
    let userIdInArray: any;
    let userId: string;

    const userGettingUpdated = {
      username: "paco",
      email: "paco@mail.com",
      avatar: "url_fake/e.com",
      password: "54321",
    };

    // Arrange
    beforeEach(async () => {
      // user = await productService.create(userTemplate);
    });
    afterEach(async () => {
      connection.eliminate({ table: "users" });
    });

    test("should return 400 if no token was provided", async () => {
      // Act
      return await request(app)
        .put(`/api/v1/products/`)
        .set({})
        .send()
        .expect(401)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 401,
            body: ErrorThrower.PRODUCT_COULDNT_UPDATE,
          });
        });
    });

    test("should return 400 if token was provided with wrong format", async () => {
      // Act
      return await request(app)
        .put(`/api/v1/products/`)
        .set({ Authorization: `GWBIOG ${token}` })
        .send()
        .expect(401)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 401,
            body: ErrorThrower.PRODUCT_COULDNT_UPDATE,
          });
        });
    });

    test("should return 500 if a user tries to update another user", async () => {
      // Act
      return await request(app)
        .put(`/api/v1/products/${userId}`) // this is the id from the TemplateUser, not Desastre's User
        .set({})
        .send()
        .expect(500)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 500,
            body: null,
          });
        });
    });

    test("should return 201 if user is updated successfully", async () => {
      return await request(app)
        .put(`/api/v1/products/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(userGettingUpdated)
        .expect(201)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 201,
            message: "Your profile was updated succesfully",
            body: SuccessfulQueryMessage.ITEM_WAS_UPDATED,
          });
        });
    });
  });

  describe("test for [DELETE] (/api/v1/products/:id -- DELETE)", () => {
    test("should return 200 if user information it's deleted", async () => {
      // pending to create orders and order items for this user to delete all info
      // also pending to manage cases where user doesn't have any orders yet and those deletions have to be omiited

      // await productService.create(product);

      // const { id } = desastreIdInArray[0];

      return await request(app)
        .delete(`/api/v1/products/`)
        .set({})
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "User deleted",
            body: SuccessfulQueryMessage.ALL_INFO_WAS_DELETE,
          });
        });
    });
  }); */
});
