import { Router } from "express";
import cartManager from "../../dao/Cart.manager.js";
import cartsModels from "../../dao/models/carts.models.js";
const router = Router();

/* obtiene todos los carritos */
router.get("/carts", async (req, res) => {
  try {
    const cart = await cartManager.get();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});

/* obtiene carrito mediante id */
router.get("/carts/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const cart = await cartManager.getById(pid);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

/* crea un nuevo carrito */
router.post("/carts", async (req, res) => {
  try {
    const { body } = req;
    let cart = await cartManager.create(body);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

/* agrega producto al carro */
router.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(201).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

/* elimina un producto del carro */
router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartManager.deleteProductCart(cid, pid);
    console.log(cart);
    res.status(201).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

router.put("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    let cart = await cartManager.updateById(cid);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.put("/carts/:cart/products/:product", async (req, res) => {
  try {
    const { cart, product } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.addProductQuantity(
      cart,
      product,
      quantity
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

export default router;
