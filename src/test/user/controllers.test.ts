const mockAuthService = jest.fn();
const mockAuthServiceRegister = jest.fn();
jest.mock("../../components/auth/services", () => {
  return {
    AuthService: mockAuthService.mockReturnValue({
      register: mockAuthServiceRegister,
      checkUserToken: jest.fn(),
      eliminateUser: jest.fn(),
    }),
  };
});

import * as userController from "../../components/user/controllers";
import { AuthService } from "../../components/auth/services";
import { Request, Response, Express } from "express";
import express from "express";
import request from "supertest";
import http from "http";
import { app } from "../..";
import { routerApi } from "../../components";

describe("test for User Controller ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let authService = new AuthService();
  let authServiceCreateSpy: jest.SpyInstance;
  let mockRequest: Request;
  let mockResponse: Response;

  beforeAll(() => {
    /*     expressApp = app;
    server = app.listen(3003); */

    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authServiceCreateSpy = jest.spyOn(authService, "register");
  });

  beforeEach(() => {
    mockRequest = {} as Request;
    mockResponse = {} as Response;
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockRequest = {} as Request;
    mockResponse = {} as Response;
  });

  describe("controller calling [register]", () => {
    test("should receive REQUEST & RESPONSE", async () => {
      await userController.register(mockRequest, mockResponse);
      expect(userControllerRegisterSpy).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
    });

    test("should receive an object from the request", () => {
      mockRequest.body = { user: "testuser", password: "12345" };
      userController.register(mockRequest, mockResponse);

      const [[receivedRequest, receivedResponse]] =
        userControllerRegisterSpy.mock.calls;
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
      expect(receivedRequest).toEqual({
        body: { user: "testuser", password: "12345" },
      });
      expect(receivedResponse).toBe(mockResponse);
    });

    test("should return the object received from the request", async () => {
      mockRequest.body = { user: "testuser", password: "12345" };
      const user = await userController.register(mockRequest, mockResponse);

      expect(user).toEqual({
        id: expect.any(String),
        user: mockRequest.body.user,
        password: mockRequest.body.password,
      });
    });

    test("should have called authService.register", async () => {
      await userController.register(mockRequest, mockResponse);

      expect(authServiceCreateSpy).toHaveBeenCalledTimes(1);
    });

    test("should have called authService.register with request.body info ", async () => {
      mockRequest.body = { user: "testuser", password: "12345" };
      await userController.register(mockRequest, mockResponse);

      const [[receivedParam]] = authServiceCreateSpy.mock.calls;

      expect(receivedParam).toEqual({ user: "testuser", password: "12345" });
    });
  });
});

//not working test. Right now it tries to log into Mysql DB even when mocking it.
/* describe("testing routes", () => {
  let expressApp: Express;

  beforeAll(() => {
    expressApp = app;
    routerApi(expressApp);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should say goodbye", (done) => {
    request(expressApp)
      .get("/goodbye")
      .expect(200)
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
          expect(response.text).toEqual("GOODBYEEEE!!");
          done();
        }
      });
  });
});
 */
