"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useWsStatus } from "~/server/use-ws-status";

export function Navigation() {
  const params = useParams();
  const userId = Number(params.id ?? 1);
  const pathname = usePathname();
  const { isConnected, transport } = useWsStatus();

  let activeTab = "";
  if (pathname.startsWith("/chat")) {
    activeTab = "chat";
  }
  if (pathname.startsWith("/profile")) {
    activeTab = "profile";
  }

  return (
    <div>
      <p>
        Status: {isConnected ? "connected" : "disconnected"}; Transport:{" "}
        {transport}
      </p>
      <Tabs defaultValue={activeTab} className="w-[400px]">
        <TabsList>
          <TabsTrigger value="chat">
            <Link href={`/chat/${userId}`}>Chat</Link>
          </TabsTrigger>
          <TabsTrigger value="profile">
            <Link href={`/profile/${userId}`}>Profile</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
