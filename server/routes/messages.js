import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { getChatMessages, sendMessage } from "../controllers/messages.js";

const router = express.Router();

/* READ */
router.get("/:chatId", getChatMessages);
router.post("/:userId/:chatId/:content", sendMessage);

export default router;
