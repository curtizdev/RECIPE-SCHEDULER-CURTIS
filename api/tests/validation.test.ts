import test from "node:test";
import { expect } from "vitest";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  userId: z.string(),
  eventTime: z.string().datetime(),
});

test("valid payload", () => {
  const result = schema.safeParse({
    title: "Test",
    userId: "user1",
    eventTime: new Date().toISOString(),
  });

  expect(result.success).toBe(true);
});

test("invalid event payload - missing title", () => {
  const data = { eventTime: new Date().toISOString() };
  expect(() => schema.parse(data)).toThrow();
});
