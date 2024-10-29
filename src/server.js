// NO TYPES IN JSserveo
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises */
import { PrismaClient } from "@prisma/client";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

await app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    const users = await prisma.user.findMany();
    const chats = await prisma.chat.findMany();

    socket.emit("users", users);
    socket.emit("initial-chats", chats);

    socket.on("get-initial-data", async () => {
      const users = await prisma.user.findMany();
      const chats = await prisma.chat.findMany();
      socket.emit("users", users);
      socket.emit("initial-chats", chats);
    });

    socket.on("send-message", async (messageData) => {
      const newMessage = await prisma.chat.create({
        data: {
          message: messageData.message,
          from: messageData.from,
          to: messageData.to,
          createdAt: new Date(),
        },
      });
      io.emit("new-message", newMessage);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
