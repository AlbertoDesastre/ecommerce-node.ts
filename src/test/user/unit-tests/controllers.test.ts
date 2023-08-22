//When creating the test section check if this is needed & continuous integration.
//Check

//TDD: Think as a user who doesn't know a thing about systems
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

import * as userController from "../../../components/user/controllers";
import { AuthService } from "../../../components/auth/services";

describe("test for User Controller ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let authService = new AuthService();
  let authServiceRegisterSpy: jest.SpyInstance;

  beforeAll(() => {
    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authServiceRegisterSpy = jest.spyOn(authService, "register");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // To check for requests/responses do directly integrations/e2e test. Things that involves pure logic will go into unit tests.
  describe("controller calling [register]", () => {
    test("should ", () => {});
  });
});
