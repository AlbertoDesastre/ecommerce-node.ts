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
    .then((result) => {
      return success({
        res,
        message: "User created succesfully",
        data: "Login using your password and user/email",
        status: 201,
      });
    })
    .catch((err) => {
      let statusCode: number;
      if (err === "User already exists") {
        statusCode = 401;
      } else {
        statusCode = 500;
      }
      return errors({ res, message: err, status: statusCode });
    });
};

const login = (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    return errors({
      res,
      message: "You can't login without providing an username or email",
      status: 400,
    });
  }

  if (!password) {
    return errors({
      res,
      message: "No password was provided",
      status: 400,
    });
  }

  authService
    .login({ username, email, password })
    .then((token) => {
      return success({
        res,
        message: "Logged in successfully",
        data: token,
        status: 201,
      });
    })
    .catch((err) => {
      console.error(err);
      return errors({
        res,
        message: err.message,
        status: 500,
      });
    });
};

const update = (req: Request, res: Response) => {
  const { username, email, password, avatar } = req.body;
  const { authorization } = req.headers;

  if (!username || !email || !password) {
    return errors({
      res,
      message:
        "Couldn't perfom this action because not enough data was provided",
      status: 400,
    });
  }

  UserService.update({
    username,
    email,
    password,
    avatar,
    token: authorization as string,
  })
    .then((result) => {
      return success({
        res,
        message: "Your profile was updated succesfully",
        data: "ok",
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: "Something wrong happend", status: 500 });
    });
};
const eliminate = (req: Request, res: Response) => {
  UserService.eliminate();
};

export { get, register, login, update, eliminate };
