import { Router } from "express";
import passport from "passport";
const router = Router();

router.post(
  "/sessions/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/profile");
  }
);

router.post(
  "/sessions/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.get("/sessions/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "no estas autorizado" });
  }

  res.status(200).json(req.session.user);
});
export default router;
