"use client";

import { useWsStatus } from "~/server/use-ws-status";

export default function Home() {
  const {isConnected, transport} = useWsStatus()

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
    </div>
  );
}

