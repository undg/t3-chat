"use client";

import Image from "next/image";
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
    socket.emit("get-initial-data");

    socket.on("users", (users: User[]) => {
      setUser(users.find(user => user.id === userId));
    });

    return () => {
      socket.off("users");
    };
  }, [userId]);

  return (
    <div>
      <div>
        {user?.avatar && (
          <Image src={user.avatar} alt="avatar" width={150} height={150} />
        )}
        {user?.name}
      </div>
      <p>
        Status: {isConnected ? "connected" : "disconnected"}; Transport: {transport}
      </p>
    </div>
  );
}
