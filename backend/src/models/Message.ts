import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  content: string;
  attachment: string;
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      trim: true,
      default: "",
    },
    attachment: {
      type: String,
      default: "",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

export default (mongoose.models.Message as Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema, "messages");
