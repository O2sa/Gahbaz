import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    attachment: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    }
  },
  { timestamps: true, }
);

export default mongoose.model("Messages", MessageSchema);