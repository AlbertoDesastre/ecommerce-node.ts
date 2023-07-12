import { router as productsRouter } from "./products/routes";

function routerApi(app) {
  app.use("/products", productsRouter);
}

export { routerApi };
