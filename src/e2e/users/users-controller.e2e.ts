import request from "supertest";
import { Express } from "express";
import http from "http";
import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
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

  describe("test for [REGISTER] (/api/v1/users/register -- POST) ", () => {
    let userStates = {
      incompleteUsername: { email: "eduardo@mail.com", password: "12345" },
      incompleteEmail: {
        email: "eduardo@mail.com",
        password: "12345",
      },
      incompletePassword: { username: "eduardo", email: "eduardo@mail.com" },
      completeUser: {
        username: "eduardo",
        email: "eduardo@mail.com",
        password: "12345",
      },
    };

    // Arrange
    beforeEach(async () => {});
    afterEach(async () => {
      connection.eliminate({ table: "users" });
    });

    test("should return 400 if username it's not provided", async () => {
      //Act
      return await request(app)
        .post("/api/v1/users/register")
        .send(userStates.incompleteUsername)
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            body: "Username, email and password must be provided to register an user",
            error: true,
            status: 400,
          });
        });
    });

    test("should return 400 if password it's not provided", async () => {
      //Act
      return await request(app)
        .post("/api/v1/users/register")
        .send(userStates.incompletePassword)
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            body: "Username, email and password must be provided to register an user",
            error: true,
            status: 400,
          });
        });
    });

    test("should return 400 if email it's not provided", async () => {
      //Act
      return await request(app)
        .post("/api/v1/users/register")
        .send(userStates.incompleteEmail)
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
        .post("/api/v1/users/register")
        .send(userStates.completeUser)
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
  });
});
