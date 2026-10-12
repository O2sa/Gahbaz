import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  accessDirectChatService,
  sendMessageService,
} from "../../src/modules/chat/chat.service.js";
import Chat from "../../src/models/Chat.js";
import Message from "../../src/models/Message.js";
import User from "../../src/models/User.js";

describe("Chat & Messaging Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create direct chat and bind sender to authenticated user when sending message", async () => {
    const mockChat = {
      _id: "chat123",
      isGroupChat: false,
      users: ["user1", "user2"],
    };

    vi.spyOn(Chat, "findOne").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockChat),
      }),
    });
    vi.spyOn(User, "populate").mockResolvedValue(mockChat);

    const chat = await accessDirectChatService("user1", "user2");
    expect(chat._id).toBe("chat123");

    const mockMessage = {
      _id: "msg123",
      sender: "user1",
      chat: "chat123",
      content: "Hello there!",
      populate: vi.fn().mockReturnThis(),
    };

    vi.spyOn(Chat, "findOne").mockResolvedValue(mockChat);
    vi.spyOn(Message, "create").mockResolvedValue(mockMessage);
    vi.spyOn(Chat, "findByIdAndUpdate").mockResolvedValue(mockChat);

    const sent = await sendMessageService({
      senderId: "user1",
      chatId: "chat123",
      content: "Hello there!",
    });

    expect(sent.sender).toBe("user1"); // Sender verified!
    expect(sent.content).toBe("Hello there!");
  });

  it("should reject sending message if user is not in the chat", async () => {
    vi.spyOn(Chat, "findOne").mockResolvedValue(null);

    await expect(
      sendMessageService({
        senderId: "unauthorized_user",
        chatId: "chat123",
        content: "Malicious message",
      })
    ).rejects.toThrow("You are not a member of this chat");
  });
});
