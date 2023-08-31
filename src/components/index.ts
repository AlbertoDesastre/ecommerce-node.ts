import { router as productRouter } from "./products/routes";
import { router as userRouter } from "./user/routes";
import { router as categoryRouter } from "./product_categories/routes";
import { router as ordersRouter } from "./orders/routes";
import express from "express";

import type { Express } from "express";

/*
1) The "app" it's in reality "express()". So, as the method "use()", when giving a string as first parameters manage it the base route.
Meaning, if add "/api/v1", that will become the base route for every request I make to the endpoints specified.
2) The next argument for "express.use()" it's a middleware. Middleware get called before passing to any other function.
3) As I'm passing a new route, I can manage groups and subgroups of routers and define their bases.
4) In case a I want customers to use version 2 of the api I just have to make a different base with "/api/v2" and use
every router designed for the new version :)
*/
function routerApi(app: Express) {
  const router = express.Router();
  app.use("/api/v1", router);

  router.use("/products", productRouter);
  router.use("/users", userRouter);
  router.use("/categories", categoryRouter);
  router.use("/orders", ordersRouter);
}

export { routerApi };
