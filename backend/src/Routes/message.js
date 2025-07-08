import express from "express";
import { getMessages, sendMessage, usersForSideBar } from "../Controllers/message.js";
import { protectRoute } from "../Middleware/auth.js";

const router = express.Router();

router.get("/users", protectRoute, usersForSideBar);
router.get("/:id", protectRoute, getMessages);
router.get("/send/:id", protectRoute, sendMessage);
export default router;