import { Router } from "express";
import ProductManager2 from "../../dao/Products.manager.js";
import { responsePaginate } from "../../dao/Products.manager.js";
import cartManager from "../../dao/Cart.manager.js";
const router = Router();

router.get("/chat", async (req, res) => {
  res.status(200).render("chat", { title: "chat" });
});

router.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const name = req.session.user.first_name;
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
    name,
    title: "Lista de productos"
  });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "hola" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "hola" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Session destroy error:", error);
      res.status(500).json({ message: "ocurrió un error" });
    } else {
      res.render("login", { title: "ingresa" });
    }
  });
});

router.get("/cartsview/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getById(cid);
    console.log(cart);

    if (!cart) {
      return res
        .status(404)
        .render("error", { message: "Carrito no encontrado" });
    }

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
