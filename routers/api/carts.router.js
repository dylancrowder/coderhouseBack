import { Router } from "express";
import cartManager from "../../dao/Cart.manager.js";
import productsModel from "../../dao/models/products.model.js";
import cartsModels from "../../dao/models/carts.models.js";
import userRegisterModel from "../../dao/models/userRegister.model.js";
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
    const userId = req.user._id; // Obtener el ID del usuario autenticado

    // Utilizar el servicio para crear el carrito y asignarlo al usuario
    let cart = await cartManager.create(userId, body);

    res.status(200).json(cart);
    console.log("sdsds", userId);
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

router.delete("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const deleteAllCart = await cartManager.deleteAll(cid);
  res.status(200).json(deleteAllCart);
});

router.post("/add-to-cart/:userId/:productId", async (req, res) => {
  try {


 
    const user = await userRegisterModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Paso 2: Buscar el producto por su ID
    const product = await productsModel.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Paso 3: Agregar el producto al array de productos en el carrito del usuario
    user.cart.products.push(product._id);

    // Paso 4: Guardar el usuario actualizado
    await user.save();

    return res
      .status(200)
      .json({ message: "Producto agregado al carrito con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
