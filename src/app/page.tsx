"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { type User } from "~/server/db";
import { socket } from "~/server/socket";

export default function Home() {
  const params = useParams();
  const userId = Number(params.id);

  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    socket.emit("get-initial-data");

    socket.on("users", (users: User[]) => {
      setUsers(users);
    });

    return () => {
      socket.off("users");
    };
  }, [userId]);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
      {users?.map((user) => (
        <Link
          key={user.id}
          href={`/chat/${user.id}`}
          className="flex items-center rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
        >
          {user.avatar && (
            <Image
              src={user.avatar}
              alt="avatar"
              width={50}
              height={50}
              className="mr-4 rounded-full"
            />
          )}
          <span className="text-lg font-semibold">Chat as {user.name}</span>
        </Link>
      ))}
    </div>
  );
}
