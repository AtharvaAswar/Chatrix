import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../Controllers/auth.js";
import { protectRoute } from "../Middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;