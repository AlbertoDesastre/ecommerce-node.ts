import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
import { routerApi } from "./components/index";
import { errors } from "./network";

const app = express();

app.use(express.json());

/* This is how it works. First I inject "express" into my router. Based on the requests, it chooses what route it's picking. For example, If I
make a request to "/products" endpoint, it will go through the router that meet the "/products" URL. Then, it will ge through the function "Router"
that I specified, where I have all the sub-routes like "filter", "?limit=10", ":id", etc...

In summary it's: Express get's injected > Choose endpoints called > Picks sub-url*/
routerApi(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error(err);
  return errors({ res, message: err.message, status: err.statusCode });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { app };
