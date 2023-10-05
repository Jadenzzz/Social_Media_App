import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import WidgetWrapper from "components/WidgetWrapper";

const MessagesListWidget = (userId) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <WidgetWrapper>
      {
        // messagesList.map((m) => (
        //   // <MessagesListCard message = m>
        //   // </MessagesListCard>
        // )
        // )
      }
    </WidgetWrapper>
  );
};

export default MessagesListWidget;
