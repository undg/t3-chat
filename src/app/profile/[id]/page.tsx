"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type User } from "~/server/db";
import { socket } from "~/server/socket";
import { useWsStatus } from "~/server/use-ws-status";

export default function Home() {
  const params = useParams();
  const userId = Number(params.id);

  const { isConnected, transport } = useWsStatus();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    socket.on("users", (users: User[]) => {
      setUser(users[userId]);
    });

    return () => {
      socket.off("users");
    };
  }, [userId]);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div>
        {user?.id} {user?.name} {user?.gender} {user?.avatar}
      </div>
    </div>
  );
}
