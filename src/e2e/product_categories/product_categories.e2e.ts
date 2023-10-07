import request from "supertest";
import { Express } from "express";
import http from "http";

import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import { app } from "../../app";
import { TableColumns as CategoryTableColumns } from "../../components/product_categories/models";
import { productCategoriesReadyToCreate } from "../exampleData";
import { ErrorThrower } from "../../components/product_categories/types";

describe("Test for *CATEGORIES* --> CONTROLLER", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;

  const expectedCategoryShape = {
    id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
    active: expect.any(Number),
    created_at: expect.any(String),
  };

  beforeAll(async () => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();
  });

  afterAll(async () => {
    await connection.eliminate({ table: "categories" });
    server.close();
  });

  describe("test for [GET] (/api/v1/categories/:productId -- GET) ", () => {
    let categoryIdInArray: any;
    let categoryId: any;
    beforeAll(async () => {
      await connection.create({
        table: "categories",
        tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
        arrayOfData: [productCategoriesReadyToCreate[0]], // this is equal to [1, "Smartphones", "Mobile devices with advanced features.", 1]
      });

      categoryIdInArray = await connection.personalizedQuery(
        `SELECT id, name FROM categories WHERE name = '${productCategoriesReadyToCreate[0][1]}'`
      );
      categoryId = categoryIdInArray[0].id;
    });

    afterAll(async () => {
      await connection.eliminate({ table: "categories" });
    });

    test("should throw error if category doesn't exists ", async () => {
      // register it's omitted

      await request(app)
        .get(`/api/v1/categories/12974124`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: ErrorThrower.CATEGORY_NOT_FOUND,
          });
        });
    });

    test("should get category information if it exists on DB", async () => {
      await request(app)
        .get(`/api/v1/categories/${categoryId}`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "This category is available",
            body: [
              {
                id: productCategoriesReadyToCreate[0][0],
                name: productCategoriesReadyToCreate[0][1],
                description: productCategoriesReadyToCreate[0][2],
                created_at: expect.any(String),
              },
            ],
          });
        });
    });
  });

  describe("test for [LIST] (/api/v1/categories/ -- GET) ", () => {
    beforeAll(async () => {
      await connection.create({
        table: "categories",
        tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
        arrayOfData: productCategoriesReadyToCreate,
      });
    });
    afterAll(async () => {
      await connection.eliminate({ table: "categories" });
    });

    test("should return up to 15 categories if no limit or offset it's passed", async () => {
      //Act
      return await request(app)
        .get("/api/v1/categories/")
        .expect(200)
        .then((response: request.Response) => {
          expect(JSON.parse(response.text)).toEqual({
            error: false,
            status: 200,
            message: "This is the list of categories",
            body: expect.arrayContaining([
              expect.objectContaining(expectedCategoryShape),
            ]),
          });

          expect(JSON.parse(response.text).body.length).toEqual(15);
        });
    });

    test("should return up to 13 categories and skip the first 2 if offset = 2 it's provided", async () => {
      //Act
      return await request(app)
        .get(`/api/v1/categories/?limit=${15}&offset=${2}`)
        .expect(200)
        .then((response: request.Response) => {
          expect(JSON.parse(response.text)).toEqual({
            error: false,
            status: 200,
            message: "This is the list of categories",
            body: expect.arrayContaining([
              expect.objectContaining(expectedCategoryShape),
            ]),
          });

          let responseBody = JSON.parse(response.text).body;

          expect(responseBody.length).toEqual(13);
          // simulate the offset effect by skipping the first 2 elements of the example categories array.
          expect(responseBody[0].name).toEqual(
            "Gaming Consoles" // the Gaming Consoles is on position 2 of the example data
          );
          expect(responseBody[responseBody.length - 1].name).toEqual(
            "Mistery" // Mistery is on position 15 of the example data
          );
        });
    });

    test("should return 5 categories, and skip the first 2 if limit = 5 & offset = 2 ", async () => {
      //Act
      return await request(app)
        .get(`/api/v1/categories/?limit=${5}&offset=${2}`)
        .expect(200)
        .then((response: request.Response) => {
          expect(JSON.parse(response.text)).toEqual({
            error: false,
            status: 200,
            message: "This is the list of categories",
            body: expect.arrayContaining([
              expect.objectContaining(expectedCategoryShape),
            ]),
          });

          let responseBody = JSON.parse(response.text).body;

          expect(responseBody.length).toEqual(5);
          // simulate the offset effect by skipping the first 2 elements of the example categories array.
          expect(responseBody[0].name).toEqual(
            "Gaming Consoles" // the Gaming Consoles is on position 2 of the example data
          );
          expect(responseBody[responseBody.length - 1].name).toEqual(
            "Drones" // "Drones" is on position 6 of the example data
          );
        });
    });
  });

  describe("test for [FILTER-BY] (/api/v1/categories/filter -- GET) ", () => {
    beforeAll(async () => {
      await connection.create({
        table: "categories",
        tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
        arrayOfData: [productCategoriesReadyToCreate[14]], // this is equal to [1, "Smartphones", "Mobile devices with advanced features.", 1]
      });
    });

    afterAll(async () => {
      await connection.eliminate({ table: "categories" });
    });

    test("should return 404 if none of the filters matchs any category", async () => {
      // Act
      return await request(app)
        .get(`/api/v1/categories/filter?name=misteryffffff`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "The category you are searching for doesn't exists.",
          });
        });
    });

    test("should return 200 if category match the filters provided", async () => {
      // this information is taken from the sample products provided in this same file, in position 0
      let category = {
        name: "Mistery",
      };

      return await request(app)
        .get(`/api/v1/categories/filter?name=${category.name}`)
        .expect(200)
        .then(async (res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Category/ies available...",
            body: [
              {
                id: 15,
                name: "Mistery",
                description: "Secrets and mystic knowledge.",
                created_at: expect.any(String),
                active: 1,
              },
            ],
          });
        });
    });
  });

  describe("test for [CREATE] (/api/v1/categories/ -- POST) ", () => {
    test("should return 400 if body wasn't provided", async () => {
      // Act
      return await request(app)
        .post("/api/v1/categories/")
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

    test("should return 201 if categories are successfully created", async () => {
      const productCategories = [
        {
          name: "Smartphones",
          description: "Mobile devices with advanced features.",
          active: true,
        },
        {
          name: "Laptops",
          description: "Portable computers for work and entertainment.",
          active: true,
        },
        {
          name: "Gaming Consoles",
          description: "Devices for playing video games.",
          active: true,
        },
      ];

      return await request(app)
        .post("/api/v1/categories/")
        .send(productCategories)
        .expect(201)
        .then(async (res) => {
          const result: any = await connection.personalizedQuery(
            `SELECT id, name FROM categories WHERE name IN ("${productCategories[0].name}", "${productCategories[1].name}", "${productCategories[2].name}"  ) `
          );

          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 201,
            message: "All category/s created",
            body: "Every item/s provided were created.",
          });

          expect(result.length).toEqual(3);
          expect(result[0].name).toEqual(productCategories[0].name);
        });
    });
  });

  describe("test for [DEACTIVATE] (/api/v1/categories/:categoryId -- DELETE) ", () => {
    beforeAll(async () => {
      await connection.create({
        table: "categories",
        tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
        arrayOfData: [productCategoriesReadyToCreate[0]],
      });
    });
    afterAll(async () => {
      await connection.eliminate({ table: "categories" });
    });

    test("should return a 404 status code if the category wasn't found", async () => {
      return await request(app)
        .delete(`/api/v1/categories/9999`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: "The category you are searching for doesn't exists.",
          });
        });
    });

    test("should deactivate a category and return a 200 status code", async () => {
      return await request(app)
        .delete(`/api/v1/categories/1`)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Category deactivated",
            body: "The item you wanted to update was indeed updated.",
          });
        });
    });

    // notice that this test depends on the state of the previous one, since it's trying to deactivate an already deactivated category
    test("should return a 500 status code if the category wasn't updated", async () => {
      return await request(app)
        .delete(`/api/v1/categories/1`)
        .expect(500)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 500,
            body: "No update was made to the category because it has the same state.",
          });
        });
    });
  });
});
