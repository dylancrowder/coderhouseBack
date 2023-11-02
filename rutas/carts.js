import express from "express";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { ProductManager } from "./claseproduct.js";

const router = express.Router();
const productos = new ProductManager();
const carritoFilePath = "./carrito.json";
const productoFilePath = "./productos.json";

/* CREA UN CARTS NUEVO */
router.post("/carts", async (req, res) => {
  try {
    const data = await fs.readFile(carritoFilePath, "utf8");
    let carritos = JSON.parse(data);

    const nuevoCarrito = {
      id: uuidv4(),
      products: req.body.products || []
    };

    carritos.push(nuevoCarrito);

    await fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2));

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* OBTIENE MEDIENTE EL ID EL CARRITO  */
router.get("/carts/:cid", async (req, res) => {
  const id = req.params.cid;

  try {
    const data = await fs.readFile(carritoFilePath, "utf8");
    const carritos = JSON.parse(data);

    const carrito = carritos.find((cart) => cart.id === id);

    if (carrito) {
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* RUTA PARA ELIMINAR */
router.delete("/carts/:cid", async (req, res) => {
  const id = req.params.cid;
  const data = await fs.readFile(carritoFilePath, "utf8");

  try {
    const elementos = JSON.parse(data);
    const elementosFiltrados = elementos.filter(
      (elemento) => elemento.id !== id
    );

    if (elementosFiltrados.length < elementos.length) {
      await fs.writeFile(
        carritoFilePath,
        JSON.stringify(elementosFiltrados, null, 2)
      );
      res.status(200).send("Elemento eliminado correctamente");
    } else {
      res.status(404).send("Elemento no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al procesar la solicitud");
  }
});

/* ruta agregarle un producto al carrito */
router.post("/:cid/producto/:pid", async (req, res) => {
  try {
    const data = await fs.readFile(carritoFilePath, "utf8");
    const carritos = JSON.parse(data);
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;

    const carrito = carritos.find((cart) => cart.id === idCarrito);

    if (carrito) {
      const dataProducto = await fs.readFile(productoFilePath, "utf8");
      const productos = JSON.parse(dataProducto);
      const producto = productos.find((prod) => prod.id === idProducto);

      if (producto) {
        const productoIds = producto.id;
        let found = false;

        for (const item of carrito.products) {
          if (item.productoIds === productoIds) {
            item.quantity++;
            found = true;
            break;
          }
        }

        if (!found) {
          carrito.products.push({ productoIds, quantity: 1 });
        }

        await fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2));

        res.status(200).json(carrito);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
