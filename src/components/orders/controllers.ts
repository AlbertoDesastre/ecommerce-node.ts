import { Request, Response } from "express";
import { MysqlError } from "mysql";

import { OrderService } from "./services";
import { success, errors } from "../../network";
import { FilterQueries, ErrorThrower } from "./types";
import { OrderModel, OrderPostRequestModel } from "./models";

/* As a general concept, controllers and in charge of managing the entry and the exit of the routes.
Controller analyze the request: if it's correct, if the body fills the rules, there are no weird things, etc...
Logic of bussines is responsability of the service. For example, how the body that will be sent on the response will look like
*/
class OrderController {
  private orderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // test done
  list(req: Request, res: Response) {
    const { userId } = req.query as { userId: string };

    if (!userId)
      return errors({
        res,
        message: "An user id must be provided in order to list their orders",
        status: 400,
      });

    this.orderService
      .list({ userId })
      .then((orders) => {
        return success({
          res,
          message: "Succesfull call, here are the results.",
          data: orders,
          status: 200,
        });
      })
      .catch((err: MysqlError) => {
        let statusCode;
        if (err.message === ErrorThrower.USER_DOESNT_EXISTS) {
          statusCode = 404;
        } else {
          statusCode = 500;
        }

        return errors({ res, message: err.message, status: statusCode });
      });
  }

  // test done
  filterBy(req: Request, res: Response) {
    const { productName, itemCreatedAt } = req.query as FilterQueries;

    if (!productName && !itemCreatedAt)
      return errors({
        res,
        message:
          "You must provide either 'productName' or 'itemCreatedAt' properties in query params to perform this action.",
        status: 400,
      });

    if (itemCreatedAt) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(itemCreatedAt)) {
        return errors({
          res,
          message: "Invalid date format. Please use the format 'YYYY-MM-DD'.",
          status: 400,
        });
      }
    }

    this.orderService
      .filterBy({ productName, itemCreatedAt })
      .then((result) => {
        return success({
          res,
          message: "Order/s available...",
          data: result,
          status: 200,
        });
      })
      .catch((err: MysqlError) => {
        let statusCode;
        if (
          err.message ===
          ErrorThrower.ORDER_ITEM_DOESNT_EXISTS_WITH_THESE_PARAMS
        ) {
          statusCode = 404;
        } else {
          statusCode = 500;
        }

        return errors({ res, message: err.message, status: statusCode });
      });
  }

  // test done
  getOne(req: Request, res: Response) {
    const { orderId } = req.params;

    this.orderService
      .getOne(orderId)
      .then((result) => {
        return success({
          res,
          message: "This order is available",
          data: result as OrderModel[],
          status: 200,
        });
      })
      .catch((err: MysqlError) => {
        let statusCode;
        if (err.message === ErrorThrower.ORDER_NOT_FOUND) {
          statusCode = 404;
        } else {
          statusCode = 500;
        }

        return errors({ res, message: err.message, status: statusCode });
      });
  }

  // test done
  create(req: Request, res: Response) {
    const order: OrderPostRequestModel = req.body;

    if (!order.user_id || !order.total_amount) {
      return errors({
        res,
        message:
          "An user id and the total amount of the order is needed to create it.",
        status: 400,
      });
    }

    if (!order.products || order.products.length === 0) {
      return errors({
        res,
        message: "There must be at least one product to create an order.",
        status: 400,
      });
    }

    const invalidProducts = order.products.filter((product) => {
      return (
        product.order_id !== null ||
        product.product_id === undefined ||
        product.quantity === undefined ||
        product.subtotal === undefined
      );
    });

    if (invalidProducts.length > 0) {
      return errors({
        res,
        message:
          "One of the properties you've passed in products array doesn't match the required model",
        status: 400,
      });
    }

    this.orderService
      .create(order)
      .then((result) => {
        return success({
          res,
          message: "Order created",
          data: `All order's items were assigned to order ${result}`,
          status: 201,
        });
      })
      .catch((err: MysqlError) => {
        return errors({ res, message: err.message, status: 500 });
      });
  }

  updateStatus(req: Request, res: Response) {
    const { id, status } = req.body;

    if (!id || !status) {
      return errors({
        res,
        message: "You didn't provide enough data to update the order",
        status: 400,
      });
    }

    if (!this.orderService.isValidOrderStatus(status)) {
      return errors({
        res,
        message: "Invalid order status",
        status: 400,
      });
    }

    this.orderService
      .updateStatus({ id, status })
      .then((result) => {
        return success({
          res,
          message: "The order was updated",
          data: `The order now has '${status}' status`,
          status: 201,
        });
      })
      .catch((err: MysqlError) => {
        let statusCode;
        if (err.message === ErrorThrower.ORDER_NOT_FOUND) {
          statusCode = 404;
        } else {
          statusCode = 500;
        }

        return errors({ res, message: err.message, status: statusCode });
      });
  }
}

export { OrderController };
