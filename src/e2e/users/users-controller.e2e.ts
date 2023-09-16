import request from "supertest";
import { Express } from "express";
import http from "http";

import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";

import * as userController from "../../components/user/controllers";
import * as userService from "../../components/user/services";
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

    test("should return 400 if the attributes are undefined, or are present but are undefined or null", async () => {
      //Act
      return await request(app)
        .post("/api/v1/users/register")
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

  describe('"test for [GET -- CONTROLLER] (/api/v1/users/register/:userId -- GET) "', () => {
    test("should throw error if user doesn't exists ", async () => {
      // register it's omitted
      const fakeId = "210491dd2mf3@";

      await request(app)
        .get(`/api/v1/users/get/${fakeId}`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: ErrorThrower.USER_DOESNT_EXISTS,
          });
        });
    });

    test("should get user information if it exists on DB", async () => {
      const userTemplate: BasicUser = {
        username: "eduardo",
        email: "eduardo@mail.com",
        password: "12345",
      };

      await userService.register(userTemplate);

      const userId: any = await connection.personalizedQuery(
        `SELECT id FROM users WHERE email = '${userTemplate.email}'`
      );

      await request(app)
        .get(`/api/v1/users/get/${userId}`)
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: ErrorThrower.USER_DOESNT_EXISTS,
          });
        });
    });
  });
});
