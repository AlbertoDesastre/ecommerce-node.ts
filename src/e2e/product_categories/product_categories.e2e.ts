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

  beforeAll(async () => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();

    /*     await connection.create({
      table: "categories",
      tableColumns: CategoryTableColumns.CATEGORIES_POST_VALUES_WITH_ID,
      arrayOfData: productCategoriesReadyToCreate,
    }); */
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

    /*
save this for testing method list

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
    }); */

    test("should throw error if product doesn't exists ", async () => {
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

    test("should get product information if it exists on DB", async () => {
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
});
