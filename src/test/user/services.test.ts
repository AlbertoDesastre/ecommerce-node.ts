const mockControllerGet = jest.fn();
const mockControllerRegister = jest.fn();
const mockControllerUpdate = jest.fn();
const mockControllerEliminate = jest.fn();

jest.mock("../../components/user/controllers", () => {
  return {
    get: mockControllerGet,
    register: mockControllerRegister,
    update: mockControllerUpdate,
    eliminate: mockControllerEliminate,
  };
});

import * as userController from "../../components/user/controllers";
import { AuthService } from "../../components/auth/services";
import { Request, Response } from "express";

describe("test for User Service ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let userServiceSpy: jest.SpyInstance;
  let authService: AuthService;
  let authServiceSpy: jest.SpyInstance;
  let request: Request;
  let response: Response;
  beforeAll(() => {
    userControllerRegisterSpy = jest.spyOn(userController, "register");
  });
  beforeEach(() => {
    /* authService = new AuthService(); */
    /*    userServiceSpy = jest.spyOn(authService, "register"); */
    jest.clearAllMocks();
  });

  describe("controller calling [register]", () => {
    test("should ", () => {});
  });
});
