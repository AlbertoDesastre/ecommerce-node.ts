import { Request, Response } from "express";
import { AuthService } from "./services";
import { success, errors } from "../../network";

class AuthController {
  private authtService;

  constructor() {
    this.authtService = new AuthService();
  }

  chekUserToken(req: Request, res: Response) {}

  eliminateUser(req: Request, res: Response) {}
}

export { AuthController };
