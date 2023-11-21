import { Server } from "socket.io";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
let io;
const productoFilePath = "./productos.json";

let products = [];

export const init = (httpServer) => {
  io = new Server(httpServer);

  io.on("connection", async (socketClient) => {
    try {
      // Leer la lista de productos desde el archivo JSON
      const data = await fs.readFile(productoFilePath, "utf8");
      products = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }

    socketClient.emit("product-list", products);

    socketClient.on("new-product", async (newProduct) => {
      try {
        const newProducts = {
          ...newProduct,
          id: uuidv4()
        };

        products.push(newProducts);
        await fs.writeFile(productoFilePath, JSON.stringify(products, null, 2));

        // Emitir la lista actualizada a todos los clientes conectados
        io.emit("product-list", products);
      } catch (error) {
        console.error(error);
      }
    });

    socketClient.on("delete-product", async (productId) => {
      try {
        // Encuentra el índice del producto que coincide con el ID proporcionado
        const productIndex = products.findIndex(
          (product) => product.id === productId
        );

        if (productIndex !== -1) {
          // Elimina el producto del array
          products.splice(productIndex, 1);

          // Guarda la lista de productos actualizada en el archivo JSON
          await fs.writeFile(
            productoFilePath,
            JSON.stringify(products, null, 2)
          );

          // Emitir la lista actualizada a todos los clientes conectados
          io.emit("product-list", products);
        } else {
          console.log(`Producto con ID ${productId} no encontrado.`);
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};
