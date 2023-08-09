import { router as userRouter } from "../../components/user/routes";
import * as userController from "../../components/user/controllers";
import { Request, Response } from "express";

describe("test for User Service ", () => {
  let userControllerSpy: jest.SpyInstance;
  let userRouterSpy: jest.SpyInstance;
  let request: Request;
  let response: Response;
  beforeAll(() => {
    userControllerSpy = jest.spyOn(userController, "register");
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("controller calling [register]", () => {
    test("should ", () => {});
  });
});
