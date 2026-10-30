import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IChat extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
  groupAdmin?: Types.ObjectId;
  groupPic?: string;
  course?: Types.ObjectId;
  university?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    groupPic: {
      type: String,
      default: "",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      index: true,
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

export default (mongoose.models.Chat as Model<IChat>) ||
  mongoose.model<IChat>("Chat", ChatSchema, "chats");
