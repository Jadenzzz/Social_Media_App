import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { accessChat } from "../controllers/chats.js";

const router = express.Router();

/* READ */
router.post("/:friendId/:_id", accessChat);

export default router;
