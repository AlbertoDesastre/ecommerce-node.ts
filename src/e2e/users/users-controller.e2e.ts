import request from "supertest";
import { Express } from "express";
import http from "http";

import { app } from "../../app";
import * as mysqlStore from "../../store/mysql";
import { ConnectionMethods, SuccessfulQueryMessage } from "../../store/types";

import * as userController from "../../components/user/controllers";
import * as userService from "../../components/user/services";
import { BasicUser } from "../../components/user/models";
import { ErrorThrower } from "../../components/user/types";
import { ErrorThrower as AuthErrorThrower } from "../../middlewares/auth-middleware/types";

describe("Test for *USER* --> CONTROLLER", () => {
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

  const userTemplate: BasicUser = {
    username: "eduardo",
    email: "eduardo@mail.com",
    password: "12345",
  };

  describe('"test for [GET] (/api/v1/users/register/:userId -- GET) "', () => {
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

  describe("test for [REGISTER] (/api/v1/users/register -- POST) ", () => {
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

  describe("test for [LOGIN] (/api/v1/users/login -- POST) ", () => {
    // Arrange
    beforeEach(async () => {});
    afterEach(async () => {
      connection.eliminate({ table: "users" });
    });

    test("should return 400 if username and email are both missing", async () => {
      // Act
      return await request(app)
        .post("/api/v1/users/login")
        .send({
          password: "password123",
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: ErrorThrower.CONTROLLER_DONT_PROVIDE_USERNAME_AND_EMAIL,
          });
        });
    });

    test("should return 400 if both username and email are provided", async () => {
      // Act
      return await request(app)
        .post("/api/v1/users/login")
        .send({
          username: "user123",
          email: "user123@example.com",
          password: "password123",
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: ErrorThrower.CONTROLLER_ONLY_ONE_PARAMETER_ACCEPTED,
          });
        });
    });

    test("should return 400 if password is missing", async () => {
      // Act
      return await request(app)
        .post("/api/v1/users/login")
        .send({
          username: "user123",
        })
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: ErrorThrower.CONTROLLER_NO_PASSWORD_PASSED,
          });
        });
    });

    test("should return 'User doesn't exists' if user wasn't found", async () => {
      // Act
      // register it's omitted for this test!

      return await request(app)
        .post("/api/v1/users/login")
        .send({
          username: "non-existing-user",
          password: "fake",
        })
        .expect(404)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 404,
            body: ErrorThrower.USER_DOESNT_EXISTS,
          });
        });
    });

    test("should return 'Password don't match' if password are not compatible", async () => {
      // Act

      await userService.register(userTemplate);

      return await request(app)
        .post("/api/v1/users/login")
        .send({
          username: userTemplate.username,
          password: "super-wrong-password",
        })
        .expect(500)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 500,
            body: ErrorThrower.PASSWORD_NOT_MATCHING,
          });
        });
    });

    test("should return a token if user exists and password matchs", async () => {
      // Act

      /* token format --> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IktGWUMyTkJDSjFSZ0xlSDRDZm5FciIsInVzZXJuYW1lIjoiYWxiZXJ0aXRvTyIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjk0ODc4NTI0fQ.Q1NLo4y7Jy_03mq5bXKd4bAT3mc9-6tOpF0PLUd31lM" */
      await userService.register(userTemplate);

      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          username: userTemplate.username,
          password: userTemplate.password,
        })
        .expect(201);

      const responseBody = JSON.parse(response.text);

      expect(responseBody.error).toBe(false);
      expect(responseBody.status).toBe(201);
      expect(responseBody.message).toBe("Logged in successfully");
      expect(responseBody.body).toBeDefined();

      const token = responseBody.body;
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(10); // Adjust this number if the JWT configuration and .env SECRET requires it
    });
  });

  describe("test for [UPDATE] (/api/v1/users/:id -- PUT)", () => {
    let user;
    let token: string;
    let userIdInArray: any;
    let userId: string;

    const userGettingUpdated = {
      username: "paco",
      email: "paco@mail.com",
      avatar: "url_fake/e.com",
      password: "54321",
    };

    // Arrange
    beforeEach(async () => {
      user = await userService.register(userTemplate);
      token = await userService.login(userTemplate);

      userIdInArray = await connection.personalizedQuery(
        `SELECT id FROM users WHERE email = '${userTemplate.email}'`
      );
      userId = userIdInArray[0].id;
    });

    afterEach(async () => {
      connection.eliminate({ table: "users" });
    });

    test("should return 400 if no token was provided", async () => {
      // Act
      return await request(app)
        .put(`/api/v1/users/update/${userId}`)
        .set({ Authorization: "" }) // pass empty string as an Authorization
        .send(userTemplate)
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: AuthErrorThrower.TOKEN_NOT_FOUND,
          });
        });
    });

    test("should return 400 if token was provided with wrong format", async () => {
      // Act
      return await request(app)
        .put(`/api/v1/users/update/${userId}`)
        .set({ Authorization: `GWBIOG ${token}` })
        .send(userTemplate)
        .expect(400)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 400,
            body: AuthErrorThrower.TOKEN_WRONG_FORMAT,
          });
        });
    });

    test("should return 500 if a user tries to update another user", async () => {
      const desastreUser = {
        username: "desastre",
        email: "desastre@mail.com",
        password: "12345",
      };
      await userService.register(desastreUser);

      const desastreToken = await userService.login(desastreUser);

      // Act
      return await request(app)
        .put(`/api/v1/users/update/${userId}`) // this is the id from the TemplateUser, not Desastre's User
        .set({ Authorization: `Bearer ${desastreToken}` })
        .send(desastreUser)
        .expect(500)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: true,
            status: 500,
            body: AuthErrorThrower.NOT_ALLOWED,
          });
        });
    });

    test("should return 201 if user is updated successfully", async () => {
      return await request(app)
        .put(`/api/v1/users/update/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(userGettingUpdated)
        .expect(201)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 201,
            message: "Your profile was updated succesfully",
            body: SuccessfulQueryMessage.ITEM_WAS_UPDATED,
          });
        });
    });
  });

  describe("test for [DELETE] (/api/v1/users/:id -- PUT)", () => {
    test("should return 200 if user information it's deleted", async () => {
      // pending to create orders and order items for this user to delete all info
      // also pending to manage cases where user doesn't have any orders yet and those deletions have to be omiited

      const desastreUser = {
        username: "desastre",
        email: "desastre@mail.com",
        password: "12345",
      };
      await userService.register(desastreUser);
      const desastreToken = await userService.login(desastreUser);

      const desastreIdInArray: any = await connection.personalizedQuery(
        `SELECT id FROM users WHERE email = '${desastreUser.email}'`
      );

      const desastreId = desastreIdInArray[0];

      return await request(app)
        .put(`/api/v1/users/update/${desastreIdInArray}`)
        .set({ Authorization: `Bearer ${desastreToken}` })
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text)).toEqual({
            error: false,
            status: 200,
            message: "Your profile was updated succesfully",
            body: SuccessfulQueryMessage.ALL_INFO_WAS_DELETE,
          });
        });
    });
  });
});
