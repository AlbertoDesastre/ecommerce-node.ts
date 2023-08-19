import { app } from "./app";

app.listen(process.env.PORT, () => {
  console.log("Listening at port: ", process.env.PORT);
});
