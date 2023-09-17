import { Request, Response } from "express";

import * as userService from "./services";
import { AuthService } from "../auth/services";
import { errors, success } from "../../network";
import { ErrorThrower } from "./types";
import { SuccessfulQueryMessage } from "../../store/types";

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
    .catch((err: Error) => {
      let statusCode;
      if (err.message === ErrorThrower.USER_DOESNT_EXISTS) {
        statusCode = 404;
      } else {
        statusCode = 500;
      }
      return errors({
        res,
        message: err.message,
        status: statusCode,
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
      message: ErrorThrower.CONTROLLER_DONT_PROVIDE_USERNAME_AND_EMAIL,
      status: 400,
    });
  }

  if (username != undefined && email != undefined) {
    return errors({
      res,
      message: ErrorThrower.CONTROLLER_ONLY_ONE_PARAMETER_ACCEPTED,
      status: 400,
    });
  }

  if (!password) {
    return errors({
      res,
      message: ErrorThrower.CONTROLLER_NO_PASSWORD_PASSED,
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
      let statusCode;
      if (err.message === ErrorThrower.USER_DOESNT_EXISTS) {
        statusCode = 404;
      }
      return errors({
        res,
        message: err.message,
        status: statusCode ? statusCode : 500,
      });
    });
};

const update = (req: Request, res: Response) => {
  const { username, email, password, avatar } = req.body;
  const { id } = req.params;

  if (!username || !email || !password) {
    return errors({
      res,
      message: ErrorThrower.CONTROLLER_NOT_ENOUGH_INFO_PROVIDED,
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
        data: SuccessfulQueryMessage.ITEM_WAS_UPDATED,
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
