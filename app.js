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
import cookieParser from "cookie-parser";
import cookies from "./routers/api/cookies.js";
import userLogin from "./routers/api/sessions.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { URI } from "./db/mongodb.js";
const SECRET = ",9O1z?Vq2yV0";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {},
      ttl: 60 * 30
    }),
    secret: SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(cookieParser());
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", productViewRouter);
app.use("/api", productRouterApi, cartRouterApi, cookies, userLogin);

const PORT = 8080;
const server = http.createServer(app);
await initMongo(server);
initChat(server);

server.listen(PORT, () => {
  console.log("CORRIENDO EL SERVIRDO");
});
