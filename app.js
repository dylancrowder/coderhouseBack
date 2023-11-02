import express from "express";
const app = express();
app.use(express.json());
import path from "path";
import productosRouter from "./rutas/Products.js";
import cartsRouter from "./rutas/carts.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import http from "http";
import { init } from "./socket.js";
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", cartsRouter);
app.use("/api", productosRouter);
const PORT = 8080;

const server = http.createServer(app);

init(server);

server.listen(PORT, () => {
  console.log("CORRIENDO EL SERVIRDO");
});
