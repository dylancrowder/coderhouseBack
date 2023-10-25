const express = require("express");
const app = express();
app.use(express.json());

const productosRouter = require("./rutas/Products.js");
const cartsRouter = require("./rutas/carts.js");

app.use("/api", cartsRouter);
app.use("/api", productosRouter);

const port = 8080;

const server = app.listen(port, () => {
  console.log(`Express escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => {
  console.log("este es el erro", error);
});
