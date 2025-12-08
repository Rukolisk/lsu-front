import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import dotenv from "dotenv";

import { createUser, findUserByEmail } from "../services/user.service";
import User, { IUser } from "../models/user";
import { RegisterDTO, LoginDTO } from "../types/dtos/user.dto";
import { AuthRequest } from "../middlewares/auth.middleware";

dotenv.config();

/* ============================
   ENV & Typage sûrs
============================ */
const JWT_SECRET_ENV = process.env.JWT_SECRET;
if (!JWT_SECRET_ENV) {
  throw new Error("JWT_SECRET is not set");
}
const JWT_SECRET: Secret = JWT_SECRET_ENV as Secret;

// expiresIn: number | ms.StringValue (ex: "1h", "7d", 3600)
const JWT_EXPIRES_IN: StringValue | number =
  (process.env.JWT_EXPIRES_IN as StringValue) ?? "1d";

/* ============================
   Helper pour signer un token
============================ */
function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function toPublicUser(user: IUser) {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

/* ============================
   Controllers
============================ */
export const register = async (req: Request, res: Response) => {
  try {
    const payload: RegisterDTO = req.body;

    const existing = await findUserByEmail(payload.email);
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const user = await createUser(payload);
    const userId = user._id.toString();

    const token = signToken({ sub: userId, typ: "access" });

    // Cookie cross-site (front Render ↔ back Render)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1h
      secure: true,           // requis avec SameSite=None (HTTPS Render)
      sameSite: "none",       // cookie cross-site (front ≠ back)
      path: "/",
    });

    const publicUser = toPublicUser(user);

    return res.status(201).json({
      user: {
        ...publicUser,
        nom: publicUser.lastName,
        prenom: publicUser.firstName,
      },
      token,
    });
  } catch (err) {
    console.error("[register] error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req: Request, res: Response) => {
try {
const payload: LoginDTO = req.body;
const user = await User.findOne({ email: payload.email });
if (!user) return res.status(401).json({ message: 'email invalide' });

console.log('User found:', user)
const match = await user.comparePassword(payload.password);
if (!match) return res.status(401).json({ message: 'mot de passe invalide' });

    const userId = user._id.toString();
    const token = signToken({ sub: userId, typ: "access" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: true,      // prod HTTPS
      sameSite: "none",  // front ≠ back
      path: "/",
    });

    const publicUser = toPublicUser(user);

    return res.json({
      user: {
        ...publicUser,
        nom: publicUser.lastName,
        prenom: publicUser.firstName,
      },
      token,
    });
  } catch (err) {
    console.error("[login] error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    return res.json(toPublicUser(user));
  } catch (err) {
    console.error("[me] error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const { firstName, lastName, email, password } = req.body ?? {};
    const trimmedFirst = typeof firstName === "string" ? firstName.trim() : undefined;
    const trimmedLast = typeof lastName === "string" ? lastName.trim() : undefined;
    const trimmedEmail = typeof email === "string" ? email.trim() : undefined;
    const trimmedPassword = typeof password === "string" ? password.trim() : undefined;

    if (trimmedEmail && trimmedEmail !== user.email) {
      const existing = await User.findOne({ email: trimmedEmail, _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }
      user.email = trimmedEmail;
    }

    if (typeof trimmedFirst === "string" && trimmedFirst.length > 0) {
      user.firstName = trimmedFirst;
    }

    if (typeof trimmedLast === "string" && trimmedLast.length > 0) {
      user.lastName = trimmedLast;
    }

    if (trimmedPassword) {
      if (trimmedPassword.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
      }
      user.password = trimmedPassword;
    }

    await user.save();
    return res.json(toPublicUser(user));
  } catch (err) {
    console.error("[updateProfile] error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
