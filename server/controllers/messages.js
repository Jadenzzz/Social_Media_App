import Message from "../models/Message";
import Chat from "../models/Chat";
import User from "../models/User";

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

//@description create new message
//@params content and chatId
//@return new message and update chat
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender").execPopulate();
    message = await message.populate("chat").execPopulate();

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
