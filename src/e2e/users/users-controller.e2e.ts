import request from "supertest";
import { Express } from "express";
import * as mysqlStore from "../../store/mysql";
import http from "http";
import { app } from "../../app";
import { ConnectionMethods } from "../../store/types";
import * as userController from "../../components/user/controllers";

describe("Test for products endpoint", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;

  let userControllerSpy: jest.SpyInstance;

  beforeAll(() => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();
    userControllerSpy = jest.spyOn(userController, "register");
  });
  afterEach(async () => {
    await connection.eliminate({ table: "users" });
    server.close();
  });
  afterAll(() => {});

  describe("test for [POST] /api/v1/users/register", () => {
    // Arrange
    beforeEach(async () => {});

    test("should ", async () => {
      //Act
      return await request(app)
        .post("/api/v1/users/register")
        .send({ username: "eduardo", password: "12345" })
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            message: "User created",
            body: [{ username: "eduardo", password: "12345" }],
            error: false,
            status: 200,
          });
        });
    });
  });
});
