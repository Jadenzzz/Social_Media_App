import Chat from "../models/Chat.js";
import User from "../models/User.js";

//@description access one to one chat
//@params userID
//@return chats
export const accessChat = async (req, res) => {
  try {
    const userId = req.params._id;
    console.log(req.params._id);
    console.log(req.params.friendId);
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.params.friendId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
      console.log(isChat[0]);
    } else {
      var chatData = {
        chatName: req.params.friendId,
        isGroupChat: false,
        users: [req.params.friendId, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users"
        );
        res.status(200).json(FullChat);
        console.log(res);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
    res;
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

export const fetchAllChats = (req, res) => {};
