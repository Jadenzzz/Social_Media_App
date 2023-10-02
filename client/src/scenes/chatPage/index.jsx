import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MessagesWidget from "./widgets/MessagesWidget";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";
import FlexBetween from "components/FlexBetween";
import MessagesListWidget from "./widgets/MessagesListWidget";

const END_POINT = "http://localhost:3001";
var socket;

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [socketConnected, setSocketConnected] = useState(false);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", _id);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  return (
    <Box>
      <Navbar />
      <Box>
        <MessagesWidget>this is messages widget</MessagesWidget>
      </Box>
      <Box>
        <MessagesListWidget> this is messages widget</MessagesListWidget>
      </Box>
    </Box>
  );
};

export default ChatPage;
