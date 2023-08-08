import { Request, Response } from "express";
import { ProductService } from "./services";
import { success, errors } from "../../network";
import { FilterQueries, Product } from "./interfaces";
import { MysqlError } from "mysql";

/* As a general concept, controllers and in charge of managing the entry and the exit of the routes.
Controller analyze the request: if it's correct, if the body fills the rules, there are no weird things, etc...
Logic of bussines is responsability of the service. For example, how the body that will be sent on the response will look like
*/
class ProductController {
  private productService;

  constructor() {
    this.productService = new ProductService();
  }

  list(req: Request, res: Response) {
    /* limit = number of maximum rows the DB should bring
       offset = where should the data start loading. For example, if offset is set to 10, it will start bring data from 10 and onwards */

    const { limit, offset } = req.query as { limit: string; offset: string };

    /*   if (!limit || !offset)
      return errors({
        res,
        message: "No pagination or offset was provided",
        status: 400,
      }); */

    this.productService
      .list({ limit, offset })
      .then((products) => {
        return success({
          res,
          message: "This is the list of products",
          data: products as Product[],
          status: 200,
        });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }

  filterBy(req: Request, res: Response) {
    const { name, price, color } = req.query as FilterQueries;

    this.productService
      .filterBy({ name, price, color })
      .then((result) => {
        if (Array.isArray(result)) {
          if (result.length === 0) {
            return errors({
              res,
              message: "No product was found",
              status: 401,
            });
          } else {
            return success({
              res,
              message: "Product/s available...",
              data: result,
              status: 201,
            });
          }
        }
      })
      .catch((err: MysqlError) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  getOne(req: Request, res: Response) {
    /* REMINDER! What comes from params it's always a string */
    const { id } = req.params;

    /* data expected to be received = array */
    this.productService
      .getOne(id)
      .then((result) => {
        if (Array.isArray(result)) {
          if (result.length === 0) {
            return errors({
              res,
              message: "No product was found",
              status: 401,
            });
          } else {
            return success({
              res,
              message: "This product is available",
              data: result,
              status: 201,
            });
          }
        }
      })
      .catch((err) => {
        return errors({ res, message: err, status: 500 });
      });
  }

  create(req: Request, res: Response) {
    const arrayOfProducts: Product[] = req.body;

    if (Object.keys(arrayOfProducts).length === 0) {
      return errors({
        res,
        message: "You didn't provide a body",
        status: 400,
      });
    }

    this.productService
      .create(arrayOfProducts)
      .then((result) => {
        return success({
          res,
          message: "All product/s created",
          data: result.message,
          status: 201,
        });
      })
      .catch((err: MysqlError) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  update(req: Request, res: Response) {
    const product: Product = req.body;

    if (Object.keys(product).length === 0) {
      return errors({
        res,
        message: "You didn't provide a body",
        status: 400,
      });
    }
    /* Aquí debería tipar que el req.body contiene un objeto específico*/
    this.productService
      .update({ product })
      .then((result) => {
        return success({
          res,
          message: "The product was updated",
          data: result.message,
          status: 201,
        });
      })
      .catch((err) => {
        return errors({ res, message: err, status: 500 });
      });
  }

  deactivateProduct(req: Request, res: Response) {
    const { id } = req.params;

    this.productService
      .deactivateProduct({ id })
      .then((result) => {
        return success({
          res,
          message: "Product deactivated",
          data: result.message,
          status: 201,
        });
      })
      .catch((err) => {
        return errors({ res, message: err, status: 500 });
      });
  }
}

export { ProductController };
