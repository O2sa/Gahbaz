
import Chat from "../models/chatModel.js";
import User from "../models/User.js";
import Messages from "../models/messageModel.js";

export const getMessages = async (req, res, next) => {
  try {

    const messages = await Messages.find({ chat: req.params.chatId })
      .populate("sender", "email avatar lastName firstName")
      .populate({ path: "chat", populate: { path: 'latestMessage', populate: { path: 'sender' } } });
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const addMessage = async (req, res, next) => {
  const { sender, chatId, content } = req.body;
  const attachmentUrl = (req.file) ? req.file.filename : '';
  
  if (!chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: sender,
    content: content,
    chat: chatId,
    attachment: attachmentUrl,
  };
  try {
    var message = await Messages.create(newMessage);
    await Chat.findByIdAndUpdate(chatId,
      {
        latestMessage: message
      },
      { new: true, }
    );
    message = await message.populate("sender", "email avatar lastName firstName");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic",
    });
    message = await message.populate({ path: 'chat', populate: { path: 'latestMessage', populate: { path: 'sender' } } });
    res.json(message);
  } catch (error) {
    res.status(400);
    next(error);
  }
};