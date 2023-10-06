import { Express } from "express";
import http from "http";
import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import * as userService from "../../components/user/services";
import { BasicUser, TableColumns } from "../../components/user/models";
import { ErrorThrower } from "../../components/user/types";

describe("Test for *USER* --> SERVICE", () => {
  let expressApp: Express;
  let server: http.Server;
  let connection: ConnectionMethods;

  const userTemplate: BasicUser = {
    username: "eduardo",
    email: "eduardo@mail.com",
    password: "12345",
  };

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
    afterEach(async () => {
      await connection.eliminate({ table: "users" });
    });

    test("authService.get should return an user when it exists", async () => {
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
    afterEach(async () => {
      await connection.eliminate({ table: "users" });
    });

    test("authService should create an user when the data it's provided", async () => {
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

  describe("test for [LOGIN -- SERVICE]", () => {
    afterEach(async () => {
      await connection.eliminate({ table: "users" });
    });

    test("should return 'User doesn't exists' if user wasn't found", async () => {
      // Act
      // register it's omitted for this test!

      expect(async () => {
        await userService.login(userTemplate);
      }).rejects.toThrowError(ErrorThrower.USER_DOESNT_EXISTS);
    });

    test("should return 'Password don't match' if password are not compatible", async () => {
      // Act

      const result = await userService.register(userTemplate);

      // this test was failing non-stop since I wasn't making the 'return', and therefore the 'afterEach' didn't wait
      // for the result of login, that has to search for a user on DB before it gets deleted
      return expect(async () => {
        await userService.login({
          username: userTemplate.username,
          email: userTemplate.password,
          password: "wrong-password",
        });
      }).rejects.toThrowError(ErrorThrower.PASSWORD_NOT_MATCHING);
    });

    test("should return a token if user exists and password matchs", async () => {
      // Act

      /* token format --> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IktGWUMyTkJDSjFSZ0xlSDRDZm5FciIsInVzZXJuYW1lIjoiYWxiZXJ0aXRvTyIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjk0ODc4NTI0fQ.Q1NLo4y7Jy_03mq5bXKd4bAT3mc9-6tOpF0PLUd31lM" */
      await userService.register(userTemplate);
      const token = await userService.login(userTemplate);

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(10); // Adjust this number if the JWT configuration and .env SECRET requires it
    });
  });
});
