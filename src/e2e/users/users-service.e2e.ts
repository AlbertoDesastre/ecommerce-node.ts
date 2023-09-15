import request from "supertest";
import { Express } from "express";
import http from "http";
import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods } from "../../store/types";
import * as userService from "../../components/user/services";
import { BasicUser } from "../../components/user/models";

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

  describe("test for [REGISTER -- SERVICE] (/api/v1/users/register -- POST) ", () => {
    test("authService should create an user when the data it's provided", async () => {
      const userTemplate: BasicUser = {
        username: "eduardo",
        email: "eduardo@mail.com",
        password: "12345",
      };

      await userService.register(userTemplate);

      // improve this test by adding the Get function to see if the consumer was in fact registered

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
