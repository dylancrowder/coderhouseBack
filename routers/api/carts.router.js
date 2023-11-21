import { Router } from "express";
import cartManager from "../../dao/Cart.manager.js";

const router = Router();

router.get("/carts", async (req, res) => {
  try {
    const cart = await cartManager.get();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});

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

router.post("/:cid/carts/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(201).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default router;
