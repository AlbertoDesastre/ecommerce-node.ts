import { Request, Response } from "express";
import { AuthService } from "./services";
import { success, errors } from "../../network";

class AuthController {
  private authtService;

  constructor() {
    this.authtService = new AuthService();
  }
  createToken(req: Request, res: Response) {
    // definitely obtains an id that comes from response. Transform it to nanoid.
    // if there is no id, an error should be thrown.
    // if it has username OR lastname (to be added).
    // call service.create function -> create in DB, create user with the token.
  }

  chekUserToken(req: Request, res: Response) {}

  eliminateUser(req: Request, res: Response) {}
}

export { AuthController };
