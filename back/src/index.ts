import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import consoRoutes from "./routes/conso.routes";
import productsRoutes from "./routes/products.routes";
import { getDailyStatsPublic } from "./controllers/conso.controller";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Render/Cloudflare est derrière un proxy TLS
app.set("trust proxy", 1);

// Liste d’origines autorisées (prod + local)
const corsOriginsEnv =
  process.env.CORS_ORIGINS || "https://glycamed.onrender.com";
const ALLOWED_ORIGINS = corsOriginsEnv.split(",").map((s) => s.trim());

// ✅ Middleware CORS universel (préflight + réponses)
//  - renvoie toujours les bons headers
//  - répond 204 aux OPTIONS
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string | undefined;

  // On met Vary: Origin pour le cache proxy
  res.header("Vary", "Origin");

  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin ?? ALLOWED_ORIGINS[0]);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    // Écho des headers demandés par le préflight (fiable sur tous navigateurs/proxy)
    const acrh = req.header("Access-Control-Request-Headers");
    res.header(
      "Access-Control-Allow-Headers",
      acrh ?? "Content-Type, Authorization"
    );

    // Réponse immédiate au préflight
    if (req.method === "OPTIONS") return res.sendStatus(204);
  }

  return next();
});

app.use(cookieParser());
app.use(express.json());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/conso", consoRoutes);
app.use("/api/products", productsRoutes);
app.get("/api/public/summary/today", getDailyStatsPublic);

// Health / ping
app.get("/healthz", (_req: Request, res: Response) =>
  res.json({ status: "ok" })
);
app.get("/", (_req: Request, res: Response) => res.json({ status: "ok" }));

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

start().catch((err) => {
  console.error("❌ Failed to start", err);
  process.exit(1);
});
