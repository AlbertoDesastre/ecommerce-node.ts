import { Request, Response } from "express";
import * as UserService from "./services";

/* DISCLAIMER!! This file contains arrow functions and not a Class for learning purposes.
The idea is to keep consistency and use Classes on the rest of the project */

const get = (req: Request, res: Response) => {
  UserService.get();
};
const create = (req: Request, res: Response) => {
  UserService.create();
};
const update = (req: Request, res: Response) => {
  UserService.update();
};
const eliminate = (req: Request, res: Response) => {
  UserService.eliminate();
};

export { get, create, update, eliminate };
