import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

// Registro
router.post("/register", passport.authenticate("register", { session: false }), (req, res) => {
  res.status(201).json({ message: "Usuario registrado con éxito", user: req.user });
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info?.message || "Error de login" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    return res.json({ message: "Login exitoso", token });
  })(req, res, next);
});

// Ruta actual (JWT)
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;
