import { router as userRouter } from "../../components/user/routes";
import * as userController from "../../components/user/controllers";
import { Request, Response } from "express";

describe("test for User Service ", () => {
  let userRouterSpy: jest.SpyInstance;
  let request: Request;
  let response: Response;

  beforeAll(() => {});
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("controller calling [register]", () => {
    test("should ", () => {});
  });
});
