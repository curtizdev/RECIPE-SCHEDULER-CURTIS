import { describe, it, expect } from "vitest";
import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";

describe("Worker job processing", () => {
  it("worker processes job", async () => {
    const connection = new IORedis({ maxRetriesPerRequest: null });
    const queueName = "reminders";

    const worker = new Worker(
      queueName,
      async (job) => {
        expect(job.data).toHaveProperty("userId");
        expect(job.data).toHaveProperty("title");
      },
      {
        connection,
      }
    );

    const queue = new Queue(queueName, { connection });

    await queue.add("test-job", {
      userId: "test",
      title: "Notify",
      eventTime: new Date().toISOString(),
    });

    // Give the job time to process
    await new Promise((res) => setTimeout(res, 500));

    await worker.close();
    await queue.close();
    await connection.quit();
  });
});
