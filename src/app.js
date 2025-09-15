import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";

import sessionRoutes from "./routes/sessions.routes.js";
import userRoutes from "./routes/users.routes.js";
import "./config/passport.config.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Rutas
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
