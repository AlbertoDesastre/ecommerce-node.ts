import "dotenv/config";
import express from "express";
import { routerApi } from "./components/index";

const app = express();

app.use(express.json());

/* This is how it works. First I inject "express" into my router. Based on the requests, it chooses what route it's picking. For example, If I
make a request to "/products" endpoint, it will go through the router that meet the "/products" URL. Then, it will ge through the function "Router"
that I specified, where I have all the sub-routes like "filter", "?limit=10", ":id", etc...

In summary it's: Express get's injected > Choose endpoints called > Picks sub-url*/
routerApi(app);

app.get("/goodbye", (req: any, res: any) => {
  res.send("GOODBYE!!");
});

export { app };