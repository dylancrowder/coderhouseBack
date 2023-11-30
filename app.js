import express from "express";
import path from "path";
const app = express();
app.use(express.json());
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import http from "http";
import { initChat } from "./socketChat.js";
import { initMongo } from "./db/mongodb.js";
import productViewRouter from "./routers/views/index.router.js";
import productRouterApi from "./routers/api/products.router.js";
import cartRouterApi from "./routers/api/carts.router.js";
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", productViewRouter);
app.use("/api", productRouterApi, cartRouterApi);

const PORT = 8080;
const server = http.createServer(app);
await initMongo(server);
initChat(server);

server.listen(PORT, () => {
  console.log("CORRIENDO EL SERVIRDO");
});
