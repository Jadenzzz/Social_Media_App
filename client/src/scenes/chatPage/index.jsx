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
import { useEffect, useRef } from "react";
import { useState } from "react";
import FlexBetween from "components/FlexBetween";
import MessagesListWidget from "./widgets/MessagesListWidget";
import { InputBar } from "./widgets/components/InputBar";
import { useParams } from "react-router-dom";
import { setChat, setMessages } from "state";
import WidgetWrapper from "components/WidgetWrapper";

const END_POINT = "http://localhost:3001";
var socket;

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
  const chatId = useRef("");
  // const messages = useSelector((state) => state.messages);
  const { friendId } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const [userMessages, setUserMessages] = useState(null);
  const [friendMessages, setFriendMessages] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [messages, setMessages] = useState([]);

  const joinChat = (chatId) => {
    socket.emit("join chat", chatId);
  };

  const accessChat = async () => {
    dispatch(setChat({ chat: "" }));
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
    console.log(chat);
    chatId.current = chat._id;
    console.log(chatId);

    //join socket room
    joinChat(chatId.current);
    // socket.emit("join chat", selectedChat._id);
  };

  const fetchMessages = async () => {
    console.log(chatId);
    setMessages([]);
    console.log("fetchMessages");
    const messages = await fetch(
      `http://localhost:3001/messages/${chatId.current}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const messageList = await messages.json();
    console.log(messageList);
    setMessages(messageList);
    console.log(messages);
    // dispatch(setMessages({ messages: messageList }));

    // socket.emit("join chat", selectedChat._id);
  };

  const sendMessages = async (content) => {
    const newMessages = await fetch(
      `http://localhost:3001/messages/${_id}/${chatId.current}/${content}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const mes = await newMessages.json();
    console.log(mes);
    socket.emit("send message", mes);
    setMessages([...messages, mes]);
    console.log(messages);
  };

  useEffect(() => {
    console.log(chatId);
    dispatch(setChat({ chat: "" }));
    chatId.current = "";
    setMessages([]);
    socket = io(END_POINT);
    socket.emit("setup", _id);
    accessChat()
      .then(() => fetchMessages())
      .catch((error) => console.error(error));
  }, []);

  //get updated messages
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("received: " + newMessageReceived);
      setMessages([...messages, newMessageReceived]);
      console.log(messages);
    });
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
              <FriendListWidget userId={_id}></FriendListWidget>
            </Box>
            <Box width="70%">
              <MessagesWidget
                userId={_id}
                friendId={friendId}
                messageList={messages}
              ></MessagesWidget>
            </Box>
          </Box>
          <Box width="100%" padding="2rem 6%">
            <WidgetWrapper>
              <div className="chat-footer">
                <input
                  type="text"
                  value={currentMessage}
                  placeholder="Hey..."
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                />
                <button onClick={() => sendMessages(currentMessage)}>
                  &#9658;
                </button>
              </div>
            </WidgetWrapper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChatPage;
