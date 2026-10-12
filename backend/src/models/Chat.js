import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      default: "",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupPic: {
      type: String,
      default: "",
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema, "chats");
