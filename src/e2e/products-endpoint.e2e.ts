import request from "supertest";
import { Express } from "express";
import * as mysqlStore from "../store/mysql";
import http from "http";
import { app } from "..";
import { ConnectionMethods } from "../store/interfaces";

describe("Test for products endpoint", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;
  beforeAll(() => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();
  });
  afterAll(() => {
    server.close();
  });

  describe("test for [GET] /api/v1/products/", () => {
    // Arrange
    beforeEach(async () => {
      const products = await connection.create({
        table: "products",
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

    afterEach(async () => {
      await connection.eliminate({ table: "products" });
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
