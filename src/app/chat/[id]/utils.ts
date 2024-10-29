import { type Chat } from "~/server/db";
import * as date from "date-fns"

export function isInTimeBoundry(chats: Chat[], index: number, interval: date.Duration) {
  if(index < 1) {
    return {timeExceeded: false}
  }

  const currTime = chats[index]?.createdAt
  const prevTime = chats[index -1]?.createdAt

  if (!currTime || !prevTime) {
    return {timeExceeded: false}
  }

  const sameChat = true

  return {timeExceeded: date.isBefore(date.add(prevTime, interval), currTime), sameChat}
}
