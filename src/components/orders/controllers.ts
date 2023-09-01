import { Request, Response } from "express";
import { OrderService } from "./services";
import { success, errors } from "../../network";
import { FilterQueries, Order } from "./types";
import { MysqlError } from "mysql";

/* As a general concept, controllers and in charge of managing the entry and the exit of the routes.
Controller analyze the request: if it's correct, if the body fills the rules, there are no weird things, etc...
Logic of bussines is responsability of the service. For example, how the body that will be sent on the response will look like
*/
class OrderController {
  private orderService;

  constructor() {
    this.orderService = new OrderService();
  }

  list(req: Request, res: Response) {
    /* limit = number of maximum rows the DB should bring
       offset = where should the data start loading. For example, if offset is set to 10, it will start bring data from 10 and onwards */

    const { limit, offset } = req.query as { limit: string; offset: string };

    this.orderService
      .list({ limit, offset })
      .then((orders) => {
        return success({
          res,
          message: "This is the list of orders ordered by date",
          data: orders as Order[],
          status: 200,
        });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }

  /*   filterBy(req: Request, res: Response) {
    const { productName, orderCreatedDate } = req.query as FilterQueries;

    this.orderService
      .filterBy({ productName, orderCreatedDate })
      .then((result) => {
        if (Array.isArray(result)) {
          if (result.length === 0) {
            return errors({
              res,
              message: "No order was found",
              status: 401,
            });
          } else {
            return success({
              res,
              message: "Order/s available...",
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
 */
  getOne(req: Request, res: Response) {
    /* REMINDER! What comes from params it's always a string */
    const { id } = req.params;

    /* data expected to be received = array */
    this.orderService
      .getOne(id)
      .then((result) => {
        if (Array.isArray(result)) {
          if (result.length === 0) {
            return errors({
              res,
              message: "No order was found",
              status: 401,
            });
          } else {
            return success({
              res,
              message: "This order is available",
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
    const arrayOfProducts: Order[] = req.body;

    if (Object.keys(arrayOfProducts).length === 0) {
      return errors({
        res,
        message: "You didn't provide a body",
        status: 400,
      });
    }

    this.orderService
      .create(arrayOfProducts)
      .then((result) => {
        return success({
          res,
          message: "All order/s created",
          data: result.message,
          status: 201,
        });
      })
      .catch((err: MysqlError) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  update(req: Request, res: Response) {
    const order: Order = req.body;

    if (Object.keys(order).length === 0) {
      return errors({
        res,
        message: "You didn't provide a body",
        status: 400,
      });
    }
    /* Aquí debería tipar que el req.body contiene un objeto específico*/
    this.orderService
      .update({ order })
      .then((result) => {
        return success({
          res,
          message: "The order was updated",
          data: result.message,
          status: 201,
        });
      })
      .catch((err) => {
        return errors({ res, message: err, status: 500 });
      });
  }

  cancellOrder(req: Request, res: Response) {
    const { id } = req.params;

    this.orderService
      .cancellOrder({ id })
      .then((result) => {
        return success({
          res,
          message: "Order deactivated",
          data: result.message,
          status: 201,
        });
      })
      .catch((err) => {
        return errors({ res, message: err, status: 500 });
      });
  }
}

export { OrderController };
