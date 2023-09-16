import request from "supertest";
import { Express } from "express";
import http from "http";
import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import * as userService from "../../components/user/services";
import { BasicUser, TableColumns } from "../../components/user/models";
import { ErrorThrower } from "../../components/user/types";
import { rejects } from "assert";

describe("Test for products endpoint", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;

  beforeAll(() => {
    expressApp = app;
    server = app.listen(3002);
    connection = mysqlStore.handleConnection();
  });
  afterEach(async () => {
    await connection.eliminate({ table: "users" });
    server.close();
  });

  describe("test for [GET -- SERVICE]", () => {
    test("authService.get should return an user when it exists", async () => {
      const userTemplate: BasicUser = {
        username: "eduardo",
        email: "eduardo@mail.com",
        password: "12345",
      };

      await userService.register(userTemplate);

      const userId: any = await connection.personalizedQuery(
        `SELECT id FROM users WHERE email = '${userTemplate.email}'`
      );
      expect(userId).toHaveLength(1);

      const user = await userService.get({ id: userId[0].id });

      expect({
        username: userTemplate.username,
        email: userTemplate.email,
        avatar: null,
      }).toEqual(user[0]);
    });

    test("authService.get should return an Error when a user doesn't exists", () => {
      // registration for this consumer it's omitted --> await userService.register(userTemplate);

      // for Async functions ".rejects" helper must be used, if the promise it's fullfilled the test will fail
      // additionally, functions that are expected to throw errors must be wrapped in another function, inside the expect
      expect(async () => {
        await userService.get({ id: "newi#@32nfw33333" });
      }).rejects.toThrowError(ErrorThrower.USER_DOESNT_EXISTS);
    });
  });

  describe("test for [REGISTER -- SERVICE]", () => {
    test("authService should create an user when the data it's provided", async () => {
      const userTemplate: BasicUser = {
        username: "eduardo",
        email: "eduardo@mail.com",
        password: "12345",
      };

      await userService.register(userTemplate);

      const registeredUser: any = await connection.personalizedQuery(
        `SELECT username, email FROM users WHERE email = '${userTemplate.email}'`
      );

      expect(registeredUser).toHaveLength(1);
      expect({
        username: userTemplate.username,
        email: userTemplate.email,
      }).toEqual({
        username: registeredUser[0].username,
        email: registeredUser[0].email,
      });
    });
  });
});
