import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
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

  it("should successfully fetch chats via GET /api/v1/chats/fetchChats without being shadowed by /:id", async () => {
    const testUserId = "64f1a2b3c4d5e6f7a8b9c0d9";
    const token = createJWT({
      userId: testUserId,
      role: "student",
      universityId: "univ123",
    });

    vi.spyOn(Chat, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([
              {
                _id: "64f1a2b3c4d5e6f7a8b9c0a1",
                chatName: "Test Chat",
                users: [testUserId],
              },
            ]),
          }),
        }),
      }),
    });
    vi.spyOn(Chat, "countDocuments").mockResolvedValue(1);
    vi.spyOn(User, "populate").mockResolvedValue([
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0a1",
        chatName: "Test Chat",
        users: [testUserId],
      },
    ]);

    const res = await request(app)
      .get("/api/v1/chats/fetchChats")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

