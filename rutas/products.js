const express = require("express");
const router = express.Router();
const { ProductManager } = require("./claseproduct.js");
const productos = new ProductManager();

// Obtener todos los productos o limitar la cantidad
router.get("/productos", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const allProducts = await productos.readProducts();

  const prodctLimit = limit ? allProducts.slice(0, limit) : allProducts;
  res.status(200).send(prodctLimit);
});

// Obtener un producto por ID
router.get("/productos/:id", async (req, res) => {
  const id = req.params.id;
  const productoByID = (await productos.readProducts()).find(
    (product) => product.id === id
  );
  if (productoByID) {
    res.status(200).send(productoByID);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.post("/productos", async (req, res) => {
  const { body } = req;
  const requiredFields = ["title", "code", "price", "stock", "category"];

  if (!requiredFields.every((field) => body[field])) {
    return res
      .status(400)
      .json({ error: "Campos obligatorios faltantes en la solicitud." });
  }

  try {
    await productos.addProduct(
      body.title,
      body.description,
      body.code,
      body.price,
      body.stock,
      body.category
    );

    res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto." });
  }
});

// Actualizar un producto por ID
router.put("/productos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;

    // Consulta el producto requerido
    const productoRequerido = await productos.readProducts();

    // Busca el índice del producto en el arreglo
    const index = productoRequerido.findIndex((product) => product.id === id);

    if (index === -1) {
      // Si el producto no se encuentra, devuelve un error
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualiza el producto
    productoRequerido[index] = {
      ...productoRequerido[index],
      ...updatedProduct,
    };

    // Escribe el producto actualizado (asegúrate de que la función writeProducts funcione correctamente)
    await productos.writeProducts(productoRequerido);

    // Responde con el producto actualizado
    res.json(productoRequerido[index]);
  } catch (error) {
    console.error("Error en la actualización del producto:", error);
    res.status(500).json({ message: "Error en la actualización del producto" });
  }
});

router.delete("/productos/:id", async (req, res) => {
  const id = req.params.id;
  const elementos = await productos.readProducts();
  // Filtrar la matriz de elementos para mantener solo los que no coinciden con el ID
  const elementosFiltrados = elementos.filter((elemento) => elemento.id !== id);

  if (elementosFiltrados.length < elementos.length) {
    await productos.writeProducts(elementosFiltrados); // Escribe la matriz filtrada
    res.status(200).send("Elemento eliminado correctamente");
  } else {
    res.status(404).send("Elemento no encontrado");
  }
});

module.exports = router;
