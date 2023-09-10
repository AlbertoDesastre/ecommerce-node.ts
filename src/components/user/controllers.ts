import { Request, Response } from "express";

import * as userService from "./services";
import { AuthService } from "../auth/services";
import { errors, success } from "../../network";
import { ErrorThrower } from "./types";

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */

const authService = new AuthService();

const get = (req: Request, res: Response) => {
  const { id } = req.params;

  userService
    .get({ id })
    .then((result) => {
      return success({
        res,
        message: "Here is the user's information:",
        data: result,
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

  userService
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
      if (err === ErrorThrower.USER_ALREADY_EXISTS) {
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

  if (username != undefined && email != undefined) {
    return errors({
      res,
      message:
        "You can only do a login with a username or an email, but not both",
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

  userService
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
  const { id } = req.params;

  if (!username || !email || !password) {
    return errors({
      res,
      message:
        "Couldn't perfom this action because not enough data was provided",
      status: 400,
    });
  }

  userService
    .update({
      id,
      username,
      email,
      password,
      avatar,
      created_at: null,
    })
    .then((result) => {
      return success({
        res,
        message: "Your profile was updated succesfully",
        data: "OK",
        status: 201,
      });
    })
    .catch((err) => {
      return errors({ res, message: err.message, status: 500 });
    });
};
const eliminate = (req: Request, res: Response) => {
  userService.eliminate();
};

export { get, register, login, update, eliminate };
