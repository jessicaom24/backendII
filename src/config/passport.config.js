import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import dotenv from "dotenv";

dotenv.config();

// Registro
passport.use("register", new LocalStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return done(null, false, { message: "Usuario ya existe" });

      const newUser = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email,
        age: req.body.age,
        password: createHash(password)
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));

// Login
passport.use("login", new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Usuario no encontrado" });

      if (!isValidPassword(password, user))
        return done(null, false, { message: "Contraseña incorrecta" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// JWT
passport.use("jwt", new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
