"use client";

import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useState, useRef } from "react";
import { isInTimeBoundry } from "~/app/chat/[id]/utils";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "~/components/ui/chat/chat-bubble";
import { ChatMessageList } from "~/components/ui/chat/chat-message-list";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type Chat } from "~/server/db";
import { socket } from "~/server/socket";

export default function Home() {
  const params = useParams();
  const userId = Number(params.id);
  // Naive shortcut. Hard assumption that there are only 2 users in app
  const sendTo: number = userId === 1 ? 2 : 1;
  const navAndFooterHeight = 150;

  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("get-initial-data");

    socket.on("initial-chats", (chats: Chat[]) => {
      setChats(chats);
    });

    socket.on("new-message", (message: Chat) => {
      setChats((oldChats) => [...oldChats, message]);
    });

    return () => {
      socket.off("initial-chats");
      socket.off("new-message");
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats]);

  // Send new message
  const sendMessage = (messageData: Chat) => (e: FormEvent) => {
    e.preventDefault();
    socket.emit("send-message", messageData);
    setMessage("");
  };

  return (
    <>
      <div
        className="overflow-y-auto"
        style={{ height: `${window.innerHeight - navAndFooterHeight}px` }}
      >
        <ChatMessageList ref={chatRef}>
          {chats.reverse().map((msg, idx) => {
            const timeBoundry = isInTimeBoundry(chats, idx, { hours: 1 });
            const userTimeBoundry = isInTimeBoundry(chats, idx, {
              seconds: 20,
            });

            return (
              <div key={msg.id}>
                <ChatBubbleTimestamp
                  className={cn(!timeBoundry.timeExceeded && "hidden")}
                  timestamp={msg.createdAt ?? ""}
                />
                <ChatBubble
                  className={cn(
                    userTimeBoundry.sameUser &&
                    userTimeBoundry.timeExceeded &&
                    "mt-5",
                  )}
                  variant={userId === msg.from ? "sent" : "received"}
                >
                  <ChatBubbleMessage>{msg.message}</ChatBubbleMessage>
                </ChatBubble>
              </div>
            );
          })}
        </ChatMessageList>
      </div>
      <form
        onSubmit={sendMessage({ message, to: sendTo, from: userId })}
        className="sticky bottom-0 bg-white p-4"
      >
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
    </>
  );
}
