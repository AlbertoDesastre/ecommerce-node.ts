import request from "supertest";
import { Express } from "express";
import http from "http";
import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import * as userController from "../../components/user/controllers";
import { BasicUser } from "../../components/user/models";
import { ErrorThrower } from "../../components/user/types";

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

  describe("test for [REGISTER -- CONTROLLER] (/api/v1/users/register -- POST) ", () => {
    // Arrange
    beforeEach(async () => {});
    afterEach(async () => {
      connection.eliminate({ table: "users" });
    });

    test("should return 400 if username it's not provided", async () => {
      //Act
      return await request(app)
        .post("/api/v1/users/register")
        .send({ email: "eduardo@mail.com", password: "12345" })
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
        .send({ username: "eduardo", email: "eduardo@mail.com" })
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
        .send({
          email: "eduardo@mail.com",
          password: "12345",
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
        .post("/api/v1/users/register")
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
      const userTemplate: BasicUser = {
        username: "eduardo",
        email: "eduardo@mail.com",
        password: "12345",
      };

      // first call registers userTemplate
      await request(app)
        .post("/api/v1/users/register")
        .send(userTemplate)
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
        .post("/api/v1/users/register")
        .send(userTemplate)
        .expect(401)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 401,
            body: ErrorThrower.USER_ALREADY_EXISTS,
          });
        });
    });
  });
});
