import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

//@description get all Messages of a chat
//@params content and chatId
//@return new message and update chat
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender")
      .populate("chat") // Populate the sender field with user details if needed
      .sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order

    if (messages.length > 0) {
      res.send(messages);
    } else {
      res.send([]);
    }
    // console.log(messages);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching chat messages:", error);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

//@description create new message
//@params content and chatId
//@return new message and update chat
export const sendMessage = async (req, res) => {
  const userId = req.params.userId;
  const chatId = req.params.chatId;
  const content = req.params.content;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    // console.log("created");
    message = await message.populate("sender");
    message = await message.populate("chat");

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};
