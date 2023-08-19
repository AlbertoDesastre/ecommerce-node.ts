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
import fetch from "node-fetch";

describe("test for User Controller ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let authService = new AuthService();
  let authServiceRegisterSpy: jest.SpyInstance;
  const url = "http://localhost:3000/api/v1/users/";

  beforeAll(() => {
    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authServiceRegisterSpy = jest.spyOn(authService, "register");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("controller calling [register]", () => {
    test("controller and service should be called when doing a request", async () => {
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

      expect(authServiceRegisterSpy).toHaveBeenCalledTimes(1);
      expect(userControllerRegisterSpy).toHaveBeenCalledTimes(1);
    });

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
    });
  });
});
