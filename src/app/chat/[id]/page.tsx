"use client";

import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "~/components/ui/chat/chat-bubble";
import { ChatInput } from "~/components/ui/chat/chat-input";
import { Input } from "~/components/ui/input";
import { type Chat, type User } from "~/server/db";
import { socket } from "~/server/socket";
import { useWsStatus } from "~/server/use-ws-status";

export default function Home() {
  const params = useParams();
  const userId = Number(params.id);
  // Naive shortcut. Hard assumption that there are only 2 users in app
  const sendTo: number = userId === 1 ? 2 : 1;

  const { isConnected, transport } = useWsStatus();

  const [users, setUsers] = useState<User[]>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("users", (users: User[]) => {
      setUsers(users);
    });

    socket.on("initial-chats", (chats: Chat[]) => {
      setChats((oldChats) => [...oldChats, ...chats]);
    });

    socket.on("new-message", (message: Chat) => {
      setChats((oldChats) => [...oldChats, message]);
    });

    return () => {
      socket.off("users");
      socket.off("initial-chats");
      socket.off("new-message");
    };
  }, []);

  // Send new message
  const sendMessage = (messageData: Chat) => (e: FormEvent) => {
    e.preventDefault();
    socket.emit("send-message", messageData);
    setMessage("");
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      {users?.map((u) => (
        <div key={u.id}>
          {u.id} {u.name} {u.gender}
        </div>
      ))}
      {chats.map((msg) => (
        <div key={msg.id}>
          <ChatBubbleTimestamp timestamp={msg.createdAt ?? ""} />
          <ChatBubble variant={userId === msg.from ? "sent" : "received"}>
            <ChatBubbleMessage>{msg.message}</ChatBubbleMessage>
          </ChatBubble>
        </div>
      ))}
      <form onSubmit={sendMessage({ message, to: sendTo, from: userId })}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </form>
    </div>
  );
}
