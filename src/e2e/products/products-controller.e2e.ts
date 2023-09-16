import request from "supertest";
import { Express } from "express";
import * as mysqlStore from "../../store/mysql";
import http from "http";
import { app } from "../../app";
import { ConnectionMethods } from "../../store/types";

describe("Test for *PRODUCTS* --> CONTROLLER", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;

  beforeAll(() => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();
  });

  afterEach(async () => {
    await connection.eliminate({ table: "order_items" });
    await connection.eliminate({ table: "orders" });
    await connection.eliminate({ table: "products" });
    server.close();
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
            11,
            "Nintendo Switch",
            "Versatile gaming console for both handheld and TV gaming.",
            127,
            90,
            "",
          ],
          [
            12,
            "Apple MacBook Pro",
            "Powerful and elegant laptop for professional use.",
            1799,
            45,
            "",
          ],
          [
            13,
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

    test("should return an array with an object' ", async () => {
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
});
