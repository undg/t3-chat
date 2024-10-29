import { describe, it, expect } from "vitest";
import { isInTimeBoundry } from "~/app/chat/[id]/utils";

describe(`isInTimeBoundry().timeExceeded`, () => {
  it(`should not exceeds time threshold for first message`, () => {
    expect(isInTimeBoundry([], 0, {}).timeExceeded).to.be.false;
  });

  it(`should return false when dates are NOT in time boundry`, () => {
    expect(
      isInTimeBoundry(
        [
          {
            createdAt: "2000-01-01T00:00:00.000Z",
            message: "",
            to: 1,
            from: 2,
          },
          {
            createdAt: "2000-01-01T00:00:30.000Z",
            message: "",
            to: 1,
            from: 2,
          },
        ],
        1,
        { hours: 1 },
      ).timeExceeded,
    ).to.be.false;
  });

  it(`should return true when dates are within time boundry`, () => {
    expect(
      isInTimeBoundry(
        [
          {
            createdAt: "2000-01-01T00:00:00.000Z",
            message: "",
            to: 1,
            from: 2,
          },
          {
            createdAt: "2000-01-01T00:00:30.000Z",
            message: "",
            to: 1,
            from: 2,
          },
        ],
        1,
        { seconds: 20 },
      ).timeExceeded,
    ).to.be.true;
  });
});
describe(`isInTimeBoundry().sameUser`, () => {
  it(`should return false if prev chat was NOT from same user`, () => {
    expect(
      isInTimeBoundry(
        [
          {
            createdAt: "2000-01-01T00:00:00.000Z",
            message: "",
            to: 1,
            from: 2,
          },
          {
            createdAt: "2000-01-01T00:00:30.000Z",
            message: "",
            to: 2,
            from: 1,
          },
        ],
        1,
        { seconds: 20 },
      ).sameUser,
    ).to.be.false;
  });

  it(`should return true if prev chat was from same user`, () => {
    expect(
      isInTimeBoundry(
        [
          {
            createdAt: "2000-01-01T00:00:00.000Z",
            message: "",
            to: 1,
            from: 2,
          },
          {
            createdAt: "2000-01-01T00:00:30.000Z",
            message: "",
            to: 1,
            from: 2,
          },
        ],
        1,
        { seconds: 20 },
      ).sameUser,
    ).to.be.true;
  });
});
