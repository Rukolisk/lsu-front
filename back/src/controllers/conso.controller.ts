// src/controllers/conso.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import Conso from "../models/conso";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createConsoService,
  getConsoByUserService,
  getAllConsoService,
  getStatByDay,
  getStatsbyWeek,
  getStatsByMonth,
} from "../services/conso.service";

/* ─────────── Objectifs & alertes ─────────── */
const SUGAR_GOAL_G = Number(process.env.DAILY_SUGAR_GOAL_G ?? 50); // 50 g
const CAFF_GOAL_MG = Number(process.env.DAILY_CAFFEINE_GOAL_MG ?? 400); // 400 mg

function buildAlerts(totalSucre: number, totalCafeine: number) {
  const sugarExceeded = totalSucre > SUGAR_GOAL_G;
  const caffeineExceeded = totalCafeine > CAFF_GOAL_MG;
  return {
    sugarExceeded,
    caffeineExceeded,
    bothExceeded: sugarExceeded && caffeineExceeded,
    goals: { sugar_g: SUGAR_GOAL_G, caffeine_mg: CAFF_GOAL_MG },
  };
}

/* 1) Créer une conso depuis un code-barres (OpenFoodFacts) */
export const createConso = async (req: AuthRequest, res: Response) => {
  try {
    const { barcode, lieu, notes } = req.body;
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "Utilisateur non authentifié" });
    if (!barcode) return res.status(400).json({ message: "Barcode manquant" });

    const r = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { timeout: 12000 }
    );
    const p = r.data?.product;
    if (!p)
      return res
        .status(404)
        .json({ message: "Produit introuvable sur OpenFoodFacts" });

    const produit = p.product_name || "Produit inconnu";
    const sucre = Number(p.nutriments?.sugars_serving ?? 0);
    const cafeine = Number(p.nutriments?.caffeine_serving ?? 0);
    const calories = Number(p.nutriments?.["energy-kcal_serving"] ?? 0);

    const conso = await Conso.create({
      produit,
      sucre,
      cafeine,
      calories,
      lieu,
      notes,
      user: userId,
      barcode,
    });
    return res.status(201).json(conso);
  } catch (err) {
    console.error("createConso error:", (err as any)?.message);
    return res
      .status(500)
      .json({ message: "Erreur serveur ou produit non trouvé" });
  }
};

/* 2) Toutes les conso (admin/tests) */
export const getConso = async (_req: AuthRequest, res: Response) => {
  try {
    const consommations = await Conso.find().sort({ createdAt: -1 });
    return res.json(consommations);
  } catch (err) {
    console.error("getConso error:", (err as any)?.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 3) Conso de l’utilisateur connecté */
export const getConsoByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "Utilisateur non authentifié" });

    const consommations = await Conso.find({ user: userId }).sort({
      createdAt: -1,
    });
    return res.json(consommations);
  } catch (err) {
    console.error("getConsoByUser error:", (err as any)?.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 4) Dashboard communautaire du jour */
export const getDailyStats = async (_req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const consommations = await Conso.find({ createdAt: { $gte: today } })
      .populate("user", "firstName lastName email") // ⬅️ uniquement firstName/lastName
      .sort({ createdAt: -1 });

    const totalSucre = consommations.reduce(
      (s, c: any) => s + (c.sucre || 0),
      0
    );
    const totalCafeine = consommations.reduce(
      (s, c: any) => s + (c.cafeine || 0),
      0
    );
    const totalCalories = consommations.reduce(
      (s, c: any) => s + (c.calories || 0),
      0
    );
    const contributionsCount = consommations.length;

    // Top produit / lieu
    const countBy = (arr: any[], key: "produit" | "lieu") => {
      const m = new Map<string, number>();
      for (const it of arr) {
        const v = (it[key] || "").toString().trim();
        if (!v) continue;
        m.set(v, (m.get(v) ?? 0) + 1);
      }
      let top: string | null = null,
        max = 0;
      for (const [k, v] of m)
        if (v > max) {
          max = v;
          top = k;
        }
      return top;
    };
    const topProduct = countBy(consommations, "produit") ?? null;
    const topPlace = countBy(consommations, "lieu") ?? null;

    // “recent” avec nom complet (fallback propre)
    const recent = consommations.slice(0, 10).map((c: any) => {
      const u = c.user || {};
      const first = (u.firstName || "").toString().trim();
      const last = (u.lastName || "").toString().trim();
      const email = (u.email || "").toString();
      const local = email.includes("@") ? email.split("@")[0] : email;
      const fullName =
        first || last ? `${first} ${last}`.trim() : local || "Quelqu'un";
      const produit = (c.produit || "").toString();
      const lieu = (c.lieu || "").toString();
      return {
        id: String(c._id),
        text: `${fullName} a ajouté ${produit}${lieu ? ` • ${lieu}` : ""}`,
        when: c.createdAt,
        product: produit || null,
        place: lieu || null,
        barcode: c.barcode || null,
        contributor: {
          id: u?._id ?? null,
          firstName: first || null,
          lastName: last || null,
          email: email || null,
          fullName,
        },
      };
    });

    const alerts = buildAlerts(totalSucre, totalCafeine);

    return res.json({
      totalSucre,
      totalCafeine,
      totalCalories,
      contributionsCount,
      totalContributions: contributionsCount,
      topProduct,
      topPlace,
      alerts,
      recent,
    });
  } catch (err) {
    console.error("getDailyStats error:", (err as any)?.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 5) Semaine (perso) */
export const getWeeklyStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "Utilisateur non authentifié" });

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const consommations = await Conso.find({
      user: userId,
      createdAt: { $gte: startOfWeek },
    });

    const totalSucre = consommations.reduce((s, c) => s + (c.sucre || 0), 0);
    const totalCafeine = consommations.reduce(
      (s, c) => s + (c.cafeine || 0),
      0
    );
    const totalCalories = consommations.reduce(
      (s, c) => s + (c.calories || 0),
      0
    );
    const totalContributions = consommations.length;

    return res.json({
      totalSucre,
      totalCafeine,
      totalCalories,
      totalContributions,
    });
  } catch (err) {
    console.error("getWeeklyStats error:", (err as any)?.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 6) Mois (perso) */
export const getMonthlyStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "Utilisateur non authentifié" });

    const date = req.body.date ? new Date(req.body.date as string) : new Date();

    const consommations = await Conso.find({
      user: userId,
      createdAt: { $gte: startOfMonth },
    });

    const totalSucre = consommations.reduce((s, c) => s + (c.sucre || 0), 0);
    const totalCafeine = consommations.reduce(
      (s, c) => s + (c.cafeine || 0),
      0
    );
    const totalCalories = consommations.reduce(
      (s, c) => s + (c.calories || 0),
      0
    );
    const totalContributions = consommations.length;

    return res.json({
      totalSucre,
      totalCafeine,
      totalCalories,
      totalContributions,
    });
  } catch (err) {
    console.error("getMonthlyStats error:", (err as any)?.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
// --- PUBLIC: Dashboard du jour (toutes consommations, sans auth) ---
export const getDailyStatsPublic = async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const consommations = await Conso.find({ createdAt: { $gte: today } })
      .populate("user", "firstName lastName email prenom nom")
      .sort({ createdAt: -1 });

    const totalSucre = consommations.reduce(
      (s: number, c: any) => s + (c.sucre || 0),
      0
    );
    const totalCafeine = consommations.reduce(
      (s: number, c: any) => s + (c.cafeine || 0),
      0
    );
    const totalCalories = consommations.reduce(
      (s: number, c: any) => s + (c.calories || 0),
      0
    );
    const contributionsCount = consommations.length;

    const countBy = (arr: any[], key: "produit" | "lieu") => {
      const m = new Map<string, number>();
      for (const it of arr) {
        const v = (it[key] || "").toString().trim();
        if (!v) continue;
        m.set(v, (m.get(v) ?? 0) + 1);
      }
      let top: string | null = null;
      let max = 0;
      for (const [k, v] of m)
        if (v > max) {
          max = v;
          top = k;
        }
      return top;
    };

    const topProduct = countBy(consommations, "produit") ?? null;
    const topPlace = countBy(consommations, "lieu") ?? null;

    const recent = consommations.slice(0, 10).map((c: any) => {
      const u = c.user || {};
      const first = u.firstName ?? u.prenom ?? "";
      const last = u.lastName ?? u.nom ?? "";
      const email = (u.email ?? "").toString();
      const fullName =
        first || last ? `${first} ${last}`.trim() : email || "Quelqu'un";
      const produit = (c.produit || "").toString();
      const lieu = (c.lieu || "").toString();
      return {
        id: String(c._id),
        text: `${fullName} a ajouté ${produit}${lieu ? ` • ${lieu}` : ""}`,
        when: c.createdAt,
        product: produit || null,
        place: lieu || null,
        barcode: c.barcode || null,
        contributor: {
          id: u?._id ?? null,
          firstName: first || null,
          lastName: last || null,
          fullName,
        },
      };
    });

    return res.json({
      totalSucre,
      totalCafeine,
      totalCalories,
      contributionsCount,
      totalContributions: contributionsCount,
      topProduct,
      topPlace,
      recent,
    });
  } catch (err) {
    console.error("getDailyStatsPublic error:", (err as any)?.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
