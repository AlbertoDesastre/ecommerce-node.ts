import { ProductService } from "./services";
import { success, errors } from "../../network";

class ProductController {
  private productService;

  constructor() {
    this.productService = new ProductService();
  }

  list(req, res) {
    /*
  limit = number of maximum rows the DB should bring
  offset = where should the data start loading. For example, if offset is set to 10, it will start bring data from 10 and onwards
  */
    /*  const { limit, offset} = req.query; */

    const limit: any = req.query.limit;
    const offset: any = req.query.offset;

    this.productService
      .list({ limit, offset })
      .then((products) => {
        return success({
          res,
          message: "This is the list of products",
          data: products,
          status: 201,
        });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
}

export { ProductController };
