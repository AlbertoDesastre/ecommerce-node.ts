import { Request, Response } from "express";
import * as UserService from "./services";
import { AuthService } from "../auth/services";
import { errors, success } from "../../network";

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */

const authService = new AuthService();

const get = (req: Request, res: Response) => {
  UserService.get();
};

const register = (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return errors({
      res,
      message:
        "Username, email and password must be provided to register an user",
      status: 400,
    });
  }

  authService
    .register({ username, email, password })
    .then((user) => {
      return success({
        res,
        message: "User created succesfully",
        data: `Login using your password and email: ${email}`,
        status: 201,
      });
    })
    .catch((err) => {
      console.error(err);
      return errors({ res, message: err, status: 500 });
    });
};

const update = (req: Request, res: Response) => {
  UserService.update();
};
const eliminate = (req: Request, res: Response) => {
  UserService.eliminate();
};

export { get, register, update, eliminate };
