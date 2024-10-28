"use client";

import { useEffect, useState } from "react";
import { ChatBubble, ChatBubbleMessage } from "~/components/ui/chat/chat-bubble";
import { ChatInput } from "~/components/ui/chat/chat-input";
import { type Chat, type User } from "~/server/db";
import { socket } from "~/server/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [users, setUsers] = useState<User[]>();
  const [chats, setChats] = useState<Chat[]>([]);

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
  const sendMessage = (messageData: Chat) => () => {
    socket.emit("send-message", messageData);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <button onClick={sendMessage({message: 'test message', to: 2, from: 1})}>Send</button>
      <ChatBubble variant='received'>
        <ChatBubbleMessage color="pink">
          afasdfaf
        </ChatBubbleMessage>
      </ChatBubble>
      <ChatInput />
    </div>
  );
}
