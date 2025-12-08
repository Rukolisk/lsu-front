import { Router } from "express";
import { searchProducts } from "../controllers/products.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Protégé pour rester cohérent avec tes autres routes 
router.get("/search", authMiddleware, searchProducts);

export default router;
