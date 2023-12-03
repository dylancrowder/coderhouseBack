import { Router } from "express";
import ProductManager2 from "../../dao/Products.manager.js";
import { responsePaginate } from "../../dao/Products.manager.js";
import cartManager from "../../dao/Cart.manager.js";
const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "productos" });
});

router.get("/chat", async (req, res) => {
  res.status(200).render("chat", { title: "chat" });
});

router.get("/products", async (req, res) => {
  const sort = "desc";
  const search = 29.99;
  const { limit = 5, page = 1 } = req.query;

  const products = await ProductManager2.get(limit, page, sort, search);
  const result = responsePaginate({
    ...products,

    sort,
    search
  });

  res.render("products", {
    ...result,
    title: "lista de productos "
  });
  console.log(result);
});

router.get("/cartsview/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getById(cid);
    console.log(cart);

    // Check if cart is valid
    if (!cart) {
      // Handle the case where cart is not found
      return res
        .status(404)
        .render("error", { message: "Carrito no encontrado" });
    }

    // Log each product for inspection
    cart.products.forEach((item, index) => {
      console.log(`Product ${index + 1}:`, item.product);
    });

    res.render("cart", { cart: cart.toJSON(), title: "carrito" });
  } catch (error) {
    console.error(error.message);
    res.status(500).render("error", { message: "Error al obtener el carrito" });
  }
});

export default router;
