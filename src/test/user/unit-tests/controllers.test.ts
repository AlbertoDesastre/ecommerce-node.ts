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

  describe("controller calling [register]", () => {
    test("should ", () => {});
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
