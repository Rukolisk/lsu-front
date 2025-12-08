import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "changeme_really_secret";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) essayer le cookie 'token' (posé par /login et /register)
  const cookieToken = (req as any).cookies?.token as string | undefined;

  // 2) sinon essayer le header Authorization: Bearer 
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;

  const token = cookieToken || headerToken;
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // Tu signes { sub: userId, typ: "access" } → lire 'sub' (fallback 'id' si ancien token)
    req.userId = payload?.sub ?? payload?.id;
    if (!req.userId) return res.status(401).json({ message: "Token invalide (sub manquant)" });
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
};
