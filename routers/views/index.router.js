import { Router } from "express";
import ProductManager2 from "../../dao/Products.manager.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "productos" });
});

router.get("/chat", async (req, res) => {
  res.status(200).render("chat", { title: "chat" });
});

router.get("/products", async (req, res) => {
  const products = await ProductManager2.get();
  res.render("products", {
    products: products.map((student) => student.toJSON()),
    title: "lista de productos "
  });
});

export default router;
