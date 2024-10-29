import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

export type Chat = {
  /** Auto created on the backed */
  readonly id?: number;
  message: string;
  /** User.id */
  from: number;
  /** User.id */
  to: number;
  /** Auto created on the backed */
  readonly createdAt?: string;
};

export type User = {
  readonly id: number;
  name: string;
  gender: string;
  avatar: string;
};

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
