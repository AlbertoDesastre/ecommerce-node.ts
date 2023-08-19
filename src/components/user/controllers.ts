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
  const { username, password } = req.body;
  authService.register({ username, password }).then((user) => {
    return success({ res, message: "User created", data: user, status: 200 });
  });
};

const update = (req: Request, res: Response) => {
  UserService.update();
};
const eliminate = (req: Request, res: Response) => {
  UserService.eliminate();
};

export { get, register, update, eliminate };
