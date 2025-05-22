import { Worker } from "bullmq";
import IORedis from "ioredis";
import { expect } from "vitest";
import test from "node:test";

test("worker processes job", async () => {
  const connection = new IORedis();
  const queueName = "reminders";
  const worker = new Worker(
    queueName,
    async (job) => {
      expect(job.data).toHaveProperty("userId");
      expect(job.data).toHaveProperty("title");
    },
    { connection }
  );

  const { Queue } = await import("bullmq");
  const queue = new Queue(queueName, { connection });
  await queue.add("test-job", {
    userId: "test",
    title: "Notify",
    eventTime: new Date().toISOString(),
  });

  // Wait briefly to let the worker process the job
  await new Promise((res) => setTimeout(res, 500));
  await worker.close();
  await queue.close();
  await connection.quit();
});
