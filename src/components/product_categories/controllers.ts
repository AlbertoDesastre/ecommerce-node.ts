import { Request, Response } from "express";
import { MysqlError } from "mysql";

import { CategoryService } from "./services";
import { success, errors } from "../../network";
import { FilterQueries } from "./types";
import { Category } from "./models";
import { ErrorThrower } from "./types";

class CategoryController {
  private categoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  list(req: Request, res: Response) {
    const { limit, offset } = req.query as { limit: string; offset: string };

    this.categoryService
      .list({ limit, offset })
      .then((categories) => {
        return success({
          res,
          message: "This is the list of categories",
          data: categories,
          status: 200,
        });
      })
      .catch((err: Error) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  filterBy(req: Request, res: Response) {
    const { name } = req.query as FilterQueries;

    if (!name) {
      return errors({
        res,
        message: "Name of the category must be provided in order to filter",
        status: 400,
      });
    }

    this.categoryService
      .filterBy({ name })
      .then((result) => {
        return success({
          res,
          message: "Category/ies available...",
          data: result,
          status: 200,
        });
      })
      .catch((err: Error) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  getOne(req: Request, res: Response) {
    const { id } = req.params;

    this.categoryService
      .getOne(id)
      .then((result) => {
        return success({
          res,
          message: "This category is available",
          data: result,
          status: 200,
        });
      })
      .catch((err: Error) => {
        let statusCode = 500;
        if (err.message === ErrorThrower.CATEGORY_NOT_FOUND) {
          statusCode = 404;
        }
        return errors({ res, message: err.message, status: statusCode });
      });
  }

  // test done
  create(req: Request, res: Response) {
    const arrayOfCategories: Category[] = req.body;

    if (Object.keys(arrayOfCategories).length === 0) {
      return errors({
        res,
        message: "You didn't provide a body",
        status: 400,
      });
    }

    this.categoryService
      .create(arrayOfCategories)
      .then((result) => {
        return success({
          res,
          message: "All category/s created",
          data: result,
          status: 201,
        });
      })
      .catch((err: Error) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  update(req: Request, res: Response) {
    const category: Category = req.body;

    if (Object.keys(category).length === 0) {
      return errors({
        res,
        message: "You didn't provide a body",
        status: 400,
      });
    }

    this.categoryService
      .update({ category })
      .then((result) => {
        return success({
          res,
          message: "The category was updated",
          data: result,
          status: 200,
        });
      })
      .catch((err: Error) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  deactivateCategory(req: Request, res: Response) {
    const { id } = req.params;

    this.categoryService
      .deactivateCategory({ id })
      .then((result) => {
        return success({
          res,
          message: "Category deactivated",
          data: result,
          status: 200,
        });
      })
      .catch((err: Error) => {
        let statusCode = 500;
        if (err.message === ErrorThrower.CATEGORY_NOT_FOUND) {
          statusCode = 404;
        }
        return errors({ res, message: err.message, status: statusCode });
      });
  }
}

export { CategoryController };
