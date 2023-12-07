import { Router } from "express";

const router = Router();
router.post("/productsCookies", (req, res) => {
  const {
    body: { fullname }
  } = req;
  res.cookie("fullname", fullname).redirect("/products");
});
export default router;
