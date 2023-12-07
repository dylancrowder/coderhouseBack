import { Router } from "express";
import ProductManager2 from "../../dao/Products.manager.js";
import { responsePaginate } from "../../dao/Products.manager.js";
const router = Router();

/* obtener todos los products */
router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, search } = req.query;
  const product = await ProductManager2.get(limit, page, sort, search);
  res.status(200).json(responsePaginate({ ...product, sort, search }));
});

/* obtener producto por id */
router.get("/products/:sid", async (req, res) => {
  const { sid } = req.params;
  const product = await ProductManager2.getById(sid);
  res.status(200).json(product);
});

/* crear producto */
router.post("/products", async (req, res) => {
  const { body } = req;
  const product = await ProductManager2.create(body);
  res.status(201).json(product);
});

/* actualizar producto */
router.put("/products/:sid", async (req, res) => {
  const { sid } = req.params;
  const { body } = req;
  await ProductManager2.updateById(sid, body);
  res.status(204).end();
});

router.delete("/products/:sid", async (req, res) => {
  const { sid } = req.params;
  await ProductManager2.deleteById(sid);
  res.status(204).end();
});

export default router;
