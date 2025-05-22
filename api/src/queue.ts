
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({ host: process.env.REDIS_HOST || 'localhost' });

export const reminderQueue = new Queue('reminders', { connection });

export const scheduleReminder = async (event: {
  id: string;
  title: string;
  eventTime: string;
  userId: string;
}) => {
  const leadMinutes = parseInt(process.env.REMINDER_LEAD_MINUTES || '10');
  const reminderTime = new Date(event.eventTime).getTime() - leadMinutes * 60000;

  await reminderQueue.add('sendReminder', event, {
    delay: reminderTime - Date.now(),
    jobId: event.id,
  });
};
