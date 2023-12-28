import User from "../../dao/models/userRegister.model.js";
import Cart from "../../dao/models/carts.models.js";
import Product from "../../dao/models/products.model.js";
import express from "express";

const router = express.Router();

// Ruta para agregar un producto al carrito
router.post("/add-to-cart", async (req, res) => {
  try {
    const userId = "6585e1242c60159dc5195203"; // Sustituye con el ID del usuario real
    const productId = "6560c1737da0600200dcbe2e"; // Sustituye con el ID del producto real

    // Busca el usuario por su ID
    const user = await User.findById(userId);

    // Busca el carrito del usuario
    let cart = await Cart.findOne({ user: user._id });

    // Si el usuario no tiene un carrito, crea uno nuevo
    if (!cart) {
      cart = await Cart.create({ user: user._id, products: [] });
    }

    // Busca el producto por su ID
    const product = await Product.findById(productId);

    // Agrega el producto al carrito
    cart.products.push({ product: product._id, quantity: 1 });

    // Guarda el carrito
    await cart.save();

    return res.json({ message: "Producto agregado al carrito con éxito." });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});

export default router;
