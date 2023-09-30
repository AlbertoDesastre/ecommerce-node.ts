import request from "supertest";
import { Express } from "express";
import http from "http";

import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import { app } from "../../app";
import { TableColumns as CategoryTableColumns } from "../../components/product_categories/models";
import { TableColumns as ProductTableColumns } from "../../components/products/models";
import { SuccessfulQueryMessage } from "../../store/types";

import { ProductService } from "../../components/products/services";
import {
  productCategoriesReadyToCreate,
  productsReadyToCreate,
} from "../exampleData";
import { ErrorThrower } from "../../components/products/types";

describe("Test for *PRODUCTS* --> CONTROLLER", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;
  let productService = new ProductService();

  const expectedProductShape = {
    category_id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
    color: expect.any(String),
    price: expect.any(Number),
    quantity: expect.any(Number),
    image: expect.any(String),
    active: expect.any(Number),
    created_at: expect.any(String),
  };

  beforeAll(async () => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();

    // I create the categories in order to create all the products necessary
    await connection.create({
      table: "categories",
      tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
      arrayOfData: productCategoriesReadyToCreate,
    });

    // Important! This array has a length of 19!
    await connection.create({
      table: "products",
      tableColumns: ProductTableColumns.PRODUCTS_POST_VALUES_FOR_TEST,
      arrayOfData: productsReadyToCreate,
    });

    // console.log(await connection.personalizedQuery(`SELECT * FROM categories`));
  });

  afterAll(async () => {
    await connection.eliminate({ table: "order_items" });
    await connection.eliminate({ table: "orders" });
    await connection.eliminate({ table: "products" });
    await connection.eliminate({ table: "categories" });
    server.close();
  });
  /* E2E, PENDING TO ADD THE FOLLOWING...
    Test Case: Limit and Offset at Database Boundaries
    Verify that the function correctly handles cases where "limit" and "offset" values provided are at the boundaries of the database.

    Test Case: Limit and Offset Exceeding Product Quantity
    Ensure that the function properly handles cases where "limit" and "offset" are greater than the total quantity of products.
   */

  describe("test for [GET] (/api/v1/products/:productId -- GET) ", () => {
    let productId: any;

    // Arrange
    beforeAll(async () => {
      // Notice a product of the sample array looks like this:
      // ["iPhone 13 Pro", "The latest flagship smartphone from Apple.", 1099.99, 50, 1, "Space Gray"
      productId = await connection.personalizedQuery(
        `SELECT id FROM products WHERE name = '${productsReadyToCreate[0][0]}'`
      );
    });

    test("should return an array with some products", async () => {
      //Act
      return await request(app)
        .get("/api/v1/products/")
        .expect(200)
        .then((response: request.Response) => {
          const responseBody = JSON.parse(response.text);

          //Assert
          expect(responseBody.body.length).toBeGreaterThan(3);
        });
    });

    test("should throw error if product doesn't exists ", async () => {
      // register it's omitted
      const fakeId = "210491dd2mf3@";

      await request(app)
        .get(`/api/v1/products/${fakeId}`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: ErrorThrower.PRODUCT_NOT_FOUND,
          });
        });
    });

    test("should get product information if it exists on DB", async () => {
      const [name, description, price, quantity, category_id, color] =
        productsReadyToCreate[0];
      const { id } = productId[0];

      await request(app)
        .get(`/api/v1/products/${id}`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "This product is available",
            body: [
              {
                category_id,
                name,
                color,
                description,
                price,
                quantity,
                image: "",
              },
            ],
          });
        });
    });
  });

  describe("test for [LIST] (/api/v1/products/ -- GET) ", () => {
    test("should return up to 15 products if no limit or offset it's passed", async () => {
      //Act
      return await request(app)
        .get("/api/v1/products/")
        .expect(200)
        .then((response: request.Response) => {
          expect(JSON.parse(response.text)).toEqual({
            error: false,
            status: 200,
            message: "This is the list of products",
            body: expect.arrayContaining([
              expect.objectContaining(expectedProductShape),
            ]),
          });

          expect(JSON.parse(response.text).body.length).toEqual(15);
        });
    });

    test("should return up to 15 products and skip the first 2 if offset = 2 it's provided", async () => {
      //Act
      return await request(app)
        .get(`/api/v1/products/?limit=${15}&offset=${2}`)
        .expect(200)
        .then((response: request.Response) => {
          expect(JSON.parse(response.text)).toEqual({
            error: false,
            status: 200,
            message: "This is the list of products",
            body: expect.arrayContaining([
              expect.objectContaining(expectedProductShape),
            ]),
          });

          let responseBody = JSON.parse(response.text).body;

          expect(responseBody.length).toEqual(15);
          // simulate the offset effect by skipping the first 2 elements of the example products array.
          expect(responseBody[0].name).toEqual(
            "Sony PlayStation 5" // the playstation is on position 2 of the example data
          );
          expect(responseBody[responseBody.length - 1].name).toEqual(
            "Microsoft Surface Pro 7" // Microsoft Surface Pro 7 is on position 17 of the example data
          );
        });
    });

    test("should return 5 products, and skip the first 2 if limit=5 & offset = 2 ", async () => {
      //Act
      return await request(app)
        .get(`/api/v1/products/?limit=${5}&offset=${2}`)
        .expect(200)
        .then((response: request.Response) => {
          expect(JSON.parse(response.text)).toEqual({
            error: false,
            status: 200,
            message: "This is the list of products",
            body: expect.arrayContaining([
              expect.objectContaining(expectedProductShape),
            ]),
          });

          let responseBody = JSON.parse(response.text).body;

          expect(responseBody.length).toEqual(5);
          // simulate the offset effect by skipping the first 2 elements of the example products array.
          expect(responseBody[0].name).toEqual(
            "Sony PlayStation 5" // the playstation is on position 2 of the example data
          );
          expect(responseBody[responseBody.length - 1].name).toEqual(
            "Canon EOS R5" // "Canon EOS R5" is on position 7 of the example data
          );
        });
    });

    /*     test("should throw error if product doesn't exists ", async () => {
      // register it's omitted
      const fakeId = "210491dd2mf3@";

      await request(app)
        .get(`/api/v1/products/${fakeId}`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: ErrorThrower.PRODUCT_NOT_FOUND,
          });
        });
    });

    test("should get product information if it exists on DB", async () => {
      const [name, description, price, quantity, category_id, color] =
        productsReadyToCreate[0];
      const { id } = productId[0];

      await request(app)
        .get(`/api/v1/products/${id}`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "This product is available",
            body: [
              {
                category_id,
                name,
                color,
                description,
                price,
                quantity,
                image: "",
              },
            ],
          });
        });
    }); */
  });

  describe("test for [FILTER-BY] (/api/v1/products/filter -- GET) ", () => {
    test("should return 404 if none of the filters matchs any product", async () => {
      // Act
      return await request(app)
        .get(`/api/v1/products/filter?price=40221&color=black&name=XFEnmdwlE`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "No product was found",
          });
        });
    });

    test("should return 200 if product match the filters provided", async () => {
      // this information is taken from the sample products provided in this same file, in position 0
      let product = {
        price: 1200,
        color: "gray",
        name: "iPhone",
      };

      return await request(app)
        .get(
          `/api/v1/products/filter?price=${product.price}&color=${product.color}&name=${product.name}`
        )
        .expect(200)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Product/s available...",
            body: [
              {
                category_id: 1,
                color: "Space Gray",
                description: "The latest flagship smartphone from Apple.",
                image: "",
                name: "iPhone 13 Pro",
                price: 1099.99,
                quantity: 50,
              },
            ],
          });
        });
    });
  });

  describe("test for [CREATE] (/api/v1/products/register -- POST) ", () => {
    test("should return 400 if body wasn't provided", async () => {
      // Act
      return await request(app)
        .post("/api/v1/products/")
        .send([])
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: "You didn't provide a body",
          });
        });
    });

    test("should return 201 if products are successfully created", async () => {
      const productsToCreate = [
        {
          category_id: 1,
          name: "Product 1",
          description: "Product description 1",
          price: 100,
          quantity: 10,
          color: "Red",
        },
        {
          category_id: 2,
          name: "Product 2",
          description: "Product description 2",
          price: 200,
          quantity: 20,
          color: "Blue",
        },
      ];

      return await request(app)
        .post("/api/v1/products/")
        .send(productsToCreate)
        .expect(201)
        .then(async (res) => {
          const result: any = await connection.personalizedQuery(
            `SELECT id FROM products WHERE name IN ("${productsToCreate[0].name}", "${productsToCreate[1].name}" ) `
          );
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 201,
            message: "All product/s created",
            body: "Every item/s provided were created.",
          });

          expect(result.length).toEqual(2);
        });
    });
  });

  describe("test for [DEACTIVATE] (/api/v1/products/:productId -- DELETE) ", () => {
    afterEach(async () => {
      await connection.eliminate({ table: "products" });
      await connection.create({
        table: "products",
        tableColumns: ProductTableColumns.PRODUCTS_POST_VALUES_FOR_TEST,
        arrayOfData: productsReadyToCreate,
      });
    });

    test("should return 404 if product wasn't found", async () => {
      // Act
      return await request(app)
        .delete("/api/v1/products/109571290")
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "No product was found",
          });
        });
    });

    test("should return 500 if product didn't change it's state", async () => {
      const productId: any = await connection.personalizedQuery(
        `SELECT id FROM products WHERE name = '${productsReadyToCreate[0][0]}'`
      );
      const { id } = productId[0];

      // first the product gets deactivated
      await request(app)
        .delete(`/api/v1/products/${id}`)
        .expect(200)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Product deactivated",
            body: "The item you wanted to update was indeed updated.",
          });
        });

      // then we try to deactivate the very same product
      return await request(app)
        .delete(`/api/v1/products/${id}`)
        .expect(500)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 500,
            body: "No update was made to the product because it has the same state.",
          });
        });
    });

    test("should return 200 if product was deactivated", async () => {
      const productId: any = await connection.personalizedQuery(
        `SELECT id FROM products WHERE name = '${productsReadyToCreate[0][0]}'`
      );
      const { id } = productId[0];

      await request(app)
        .delete(`/api/v1/products/${id}`)
        .expect(200)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Product deactivated",
            body: "The item you wanted to update was indeed updated.",
          });
        });
    });
  });
});
