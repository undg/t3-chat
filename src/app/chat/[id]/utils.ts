import { type Chat } from "~/server/db";
import * as date from "date-fns";

export function isInTimeBoundry(
  chats: Chat[],
  index: number,
  interval: date.Duration,
) {
  if (index < 1) {
    return { timeExceeded: false, sameUser: true };
  }

  const sameUser = chats[index]?.to === chats[index -1]?.to;

  const currTime = chats[index]?.createdAt;
  const prevTime = chats[index - 1]?.createdAt;

  if (!currTime || !prevTime) {
    return { timeExceeded: false, sameUser };
  }

  const prevPlusInterval = date.add(prevTime, interval)
  const timeExceeded = date.isBefore(prevPlusInterval, currTime)

  return {
    timeExceeded,
    sameUser,
  };
}
