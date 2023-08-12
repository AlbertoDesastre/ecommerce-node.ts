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
import { Request, Response, response } from "express";

describe("test for User Controller ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let authService = new AuthService();
  let authServiceCreateSpy: jest.SpyInstance;
  let request: Request;
  let response: Response;

  beforeAll(() => {
    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authServiceCreateSpy = jest.spyOn(authService, "register");
  });

  beforeEach(() => {
    request = {} as Request;
    response = {} as Response;
    jest.clearAllMocks();
  });

  afterEach(() => {
    request = {} as Request;
    response = {} as Response;
  });

  describe("controller calling [register]", () => {
    test("should receive REQUEST & RESPONSE", async () => {
      await userController.register(request, response);
      expect(userControllerRegisterSpy).toHaveBeenCalledWith(request, response);
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
    });

    test("should receive an object from the request", () => {
      request.body = { user: "testuser", password: "12345" };
      userController.register(request, response);

      const [[receivedRequest, receivedResponse]] =
        userControllerRegisterSpy.mock.calls;
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
      expect(receivedRequest).toEqual({
        body: { user: "testuser", password: "12345" },
      });
      expect(receivedResponse).toBe(response);
    });

    test("should return the object received from the request", async () => {
      request.body = { user: "testuser", password: "12345" };
      const user = await userController.register(request, response);

      expect(user).toEqual({
        id: expect.any(String),
        user: "testuser",
        password: "12345",
      });
    });

    test("should have called authService.register", async () => {
      await userController.register(request, response);

      expect(authServiceCreateSpy).toHaveBeenCalledTimes(1);
    });

    test("should have called authService.register with request.body info ", async () => {
      request.body = { user: "testuser", password: "12345" };
      await userController.register(request, response);

      const [[receivedParam]] = authServiceCreateSpy.mock.calls;

      expect(receivedParam).toEqual({ user: "testuser", password: "12345" });
    });
  });
});
