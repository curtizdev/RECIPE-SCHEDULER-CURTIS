import { describe, it, expect } from "vitest";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  userId: z.string(),
  eventTime: z.string().datetime(),
});

describe("Event schema validation", () => {
  it("valid payload", () => {
    const result = schema.safeParse({
      title: "Test",
      userId: "user1",
      eventTime: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });

  it("invalid event payload - missing title", () => {
    const data = { userId: "user1", eventTime: new Date().toISOString() };
    expect(() => schema.parse(data)).toThrow();
  });
});
