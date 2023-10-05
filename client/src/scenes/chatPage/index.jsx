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
import { InputBar } from "./widgets/components/InputBar";
import { useParams } from "react-router-dom";

const END_POINT = "http://localhost:3001";
var socket, selectedChatCompare;

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [socketConnected, setSocketConnected] = useState(false);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [chat, setChat] = useState(null);
  const { friendId } = useParams();

  const accessChat = async () => {
    const access = await fetch(
      `http://localhost:3001/chats/${friendId}/${_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: _id }),
      }
    );
    const chats = await access.json();

    setChat(chats);
    console.log(chats._id);
    // socket.emit("join chat", selectedChat._id);
  };

  //  const login = async (values, onSubmitProps) => {
  //    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
  //      method: "POST",
  //      headers: { "Content-Type": "application/json" },
  //      body: JSON.stringify(values),
  //    });
  //    const loggedIn = await loggedInResponse.json();
  //    onSubmitProps.resetForm();
  //    if (loggedIn) {
  //      dispatch(
  //        setLogin({
  //          user: loggedIn.user,
  //          token: loggedIn.token,
  //        })
  //      );
  //      navigate("/home");
  //    }
  //  };

  const fetchMessages = async () => {};

  const sendMessages = async () => {};

  const typingHandler = async () => {};

  useEffect(() => {
    accessChat();
    console.log(chat);
  }, []);
  return (
    <>
      <Box>
        <Navbar />
        <Box display={"block"} gap="2rem" alignItems={"center"}>
          <Box
            width="100%"
            padding="2rem 6%"
            display={"flex"}
            gap="2rem"
            justifyContent={"center"}
          >
            <Box width="30%">
              <MessagesListWidget></MessagesListWidget>
            </Box>
            <Box width="70%">
              <MessagesWidget></MessagesWidget>
            </Box>
          </Box>
          <Box width="100%" padding="2rem 6%">
            <InputBar></InputBar>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChatPage;
