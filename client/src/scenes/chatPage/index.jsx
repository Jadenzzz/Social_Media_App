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
import { setChat, setMessages } from "state";

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
  const chat = useSelector((state) => state.chat);
  const messages = useSelector((state) => state.messages);
  const { friendId } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const [userMessages, setUserMessages] = useState(null);
  const [friendMessages, setFriendMessages] = useState(null);
  const [messageList, setMessageList] = useState([]);
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

    dispatch(setChat({ chat: chats }));
    // socket.emit("join chat", selectedChat._id);
  };

  const fetchMessages = async () => {
    console.log("fetchMessages");
    const messages = await fetch(`http://localhost:3001/messages/${chat._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const messageseList = await messages.json();
    dispatch(setMessages({ messages: messageseList }));
    console.log(messageList);
    // dispatch(setMessages({ messages: messageList }));

    // socket.emit("join chat", selectedChat._id);
  };

  // const sendMessages = async () => {
  //   const messages = await fetch(
  //     `http://localhost:3001/chats/${_id}/${chat._id}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   const messageseList = await messages.json();
  //   // dispatch(setMessages({ messages: messageList }));
  // };

  const typingHandler = async () => {};

  useEffect(() => {
    accessChat();
    console.log(chat._id);
  }, []);

  //get updated messages
  useEffect(() => {
    //fetchMessages();
  });
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
              <input
                type="text"
                value={currentMessage}
                placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                // onKeyPress={(event) => {
                //   event.key === "Enter" && sendMessage();
                // }}
              />
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
