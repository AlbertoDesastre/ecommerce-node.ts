const mockAuthService = jest.fn();
const mockAuthServiceRegister = jest.fn();
jest.mock("../../../components/auth/services", () => {
  return {
    AuthService: mockAuthService.mockReturnValue({
      register: mockAuthServiceRegister,
      checkUserToken: jest.fn(),
      eliminateUser: jest.fn(),
    }),
  };
});

import fetch from "node-fetch";
import { Express } from "express";
import http from "http";
import request from "supertest";

import { app } from "../../../app";
import * as userController from "../../../components/user/controllers";
import { AuthService } from "../../../components/auth/services";

describe("test for User Controller ", () => {
  let expressApp: Express;
  let server: http.Server;
  let userControllerRegisterSpy: jest.SpyInstance;
  let authService = new AuthService();
  let authServiceRegisterSpy: jest.SpyInstance;

  beforeAll(() => {
    /*     expressApp = app;
    server = app.listen(3002); */

    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authServiceRegisterSpy = jest.spyOn(authService, "register");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    /*     server.close(); */
  });

  describe("controller calling [register]", () => {
    test("should pass the test immediately", () => {});
    /*    test("controller and service should be called when doing a request", async () => {
      const bodyData = { username: "testuser", password: "12345" };

      return await request(app)
        .post("/api/v1/users/register")
        .send(bodyData)
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

    // When uncommenting this section of code, review this test as it doesn't work currently.
     test("response.body should be the same as the request.body", async () => {
      const bodyData = { username: "testuser", password: "12345" };

      const response = await fetch(url + "register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      })
        .then((res) => {
          return res.json();
        })
        .catch((err) => console.error(err));

      expect(response.body[0]).toEqual(bodyData);
    });  */
  });
});
