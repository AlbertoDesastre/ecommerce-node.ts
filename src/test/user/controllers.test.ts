const mockAuthService = jest.fn();
const mockAuthServiceCreate = jest.fn();
jest.mock("../../components/auth/services", () => {
  return {
    AuthService: mockAuthService.mockReturnValue({
      create: mockAuthServiceCreate,
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
    authServiceCreateSpy = jest.spyOn(authService, "create");
  });

  beforeEach(() => {
    request = {} as Request;
    response = {} as Response;
    jest.clearAllMocks();
  });

  describe("controller calling [register]", () => {
    test("should receive REQUEST & RESPONSE", () => {
      userController.register(request, response);
      expect(userControllerRegisterSpy).toHaveBeenCalledWith(request, response);
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
    });

    test("should return an object with user properties", () => {
      const value = userController.register(request, response);
      expect(value).toMatchObject({
        id: expect.any(String),
        user: expect.any(String),
        password: expect.any(String),
      });
    });

    test("should have called authService.register", () => {
      userController.register(request, response);

      expect(authServiceCreateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
