import { Router } from "express";
import User from "../models/User.js";
import passport from "passport";
import { createHash } from "../utils/bcrypt.js";

const router = Router();

// 🔹 Obtener todos los usuarios
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios", error });
  }
});

// 🔹 Obtener usuario por ID
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuario", error });
  }
});

// 🔹 Actualizar usuario
router.put("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    if (req.body.password) req.body.password = createHash(req.body.password);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando usuario", error });
  }
});

// 🔹 Eliminar usuario
router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando usuario", error });
  }
});

export default router;
