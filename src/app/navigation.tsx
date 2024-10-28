"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function Navigation() {
  const params = useParams();
  const userId = Number(params.id);
  const pathname = usePathname();

  let activeTab = "";
  if (pathname.startsWith("/chat")) {
    activeTab = "chat";
  }
  if (pathname.startsWith("/profile")) {
    activeTab = "profile";
  }

  return (
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
  );
}
