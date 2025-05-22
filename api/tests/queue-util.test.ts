import { Queue } from "bullmq";
import IORedis from "ioredis";
import test from "node:test";
import { expect } from "vitest";

test("enqueue job with correct data", async () => {
  const connection = new IORedis();
  const queue = new Queue("reminders", { connection });
  const job = await queue.add("test-job", {
    userId: "123",
    title: "Boil eggs",
    eventTime: "2025-05-25T08:00:00Z",
  });
  expect(job.id).toBeDefined();
  await queue.close();
  await connection.quit();
});
