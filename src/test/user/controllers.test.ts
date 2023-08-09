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

  describe("controller calling [register]", () => {
    test("should receive REQUEST & RESPONSE", async () => {
      await userController.register(request, response);
      expect(userControllerRegisterSpy).toHaveBeenCalledWith(request, response);
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
    });

    test("should return an object with user properties", async () => {
      const value = await userController.register(request, response);
      expect(value).toMatchObject({
        id: expect.any(String),
        user: expect.any(String),
        password: expect.any(String),
      });
    });

    test("should have called authService.register", async () => {
      await userController.register(request, response);

      expect(authServiceCreateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
