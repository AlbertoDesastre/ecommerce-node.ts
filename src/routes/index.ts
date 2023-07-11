import { router as productsRouter } from "./products.route";

function routerApi(app) {
  app.use("/products", productsRouter);
}

export { routerApi };
