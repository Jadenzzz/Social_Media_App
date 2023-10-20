import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import WidgetWrapper from "components/WidgetWrapper";
import ScrollToBottom from "react-scroll-to-bottom";
import { useEffect } from "react";
const MessagesWidget = ({ userId, friendId, messageList }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <WidgetWrapper>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            // console.log(messageContent.sender);
            return (
              <div
                className="message"
                id={userId === messageContent.sender._id ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.content}</p>
                  </div>
                  <div className="message-meta">
                    {/* <p id="time">{messageContent.createdAt}</p>
                    <p id="author">{messageContent.sender}</p> */}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
    </WidgetWrapper>
  );
};

export default MessagesWidget;
