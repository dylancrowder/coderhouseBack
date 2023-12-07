import { Router } from "express";
import userloginModel from "../../dao/models/userRegister.model.js";
const router = Router();

router.post("/sessions/login", async (req, res) => {
  const {
    body: { email, password }
  } = req;

  if (!email || !password) {
    return res.render("error", {
      title: "Error",
      messageError: "Both email and password are required."
    });
  }

  const user = await userloginModel.findOne({ email });

  if (!user) {
    return res.render("error", { title: "Error" });
  }

  // Compare the provided password with the stored password directly
  if (password !== user.password) {
    return res.render("error", {
      title: "Error",
      messageError: "Invalid password."
    });
  }

  const { first_name, last_name, age, role } = user;

  req.session.user = {
    first_name,
    last_name,
    email,
    role,
    age
  };
  res.redirect("/profile");
});

router.post("/sessions/register", async (req, res) => {
  const {
    body: { first_name, last_name, email, password, age }
  } = req;

  if (!first_name || !last_name || !email || !password) {
    return res.render("error", {
      title: "error",
      messageError: "todos los campos son"
    });
  }

  const user = await userloginModel.create({
    first_name,
    last_name,
    email,
    password,
    age
  });
  res.redirect("/login");
});

router.get("/sessions/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "no estas autorizado" });
  }

  res.status(200).json(req.session.user);
});
export default router;
