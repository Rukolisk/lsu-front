import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.patch("/me", authMiddleware, updateProfile);

export default router;
