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
  const sort = "desc";
  const search = 29.99;
  const { limit = 5, page = 1 } = req.query;

  const products = await ProductManager2.get(limit, page, sort, search);
  const result = ProductManager2.responsePaginate({
    ...products,
    sort,
    search
  });

  res.render("products", {
    ...result,
    title: "lista de productos "
  });
});

export default router;
