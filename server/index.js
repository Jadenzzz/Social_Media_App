import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatRoutes from "./routes/chats.js";
import messagesRoutes from "./routes/messages.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts, messageData } from "./data/index.js";
import http from "http";
import { Server } from "socket.io";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
import { chats } from "./data/index.js";
import { connectDB } from "./config/db.js";
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messagesRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
connectDB();
const server = app.listen(PORT, () => {
  // console.log(`Server running on ${PORT}`);
});
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io" + socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log("User joined their own room");
    // console.log(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });

  socket.on("send message", (data) => {
    const JSONdata = JSON.parse(data);
    var chat = JSONdata.chat;
    console.log("socket" + data);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == JSONdata.sender._id) return;
      var message = JSON.stringify(JSONdata);
      socket.in(user._id).emit("message received", message);
    });
  });
});
