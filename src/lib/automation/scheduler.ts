import * as cron from 'node-cron';
import { runAutomation } from './engine';

let dailyJob: cron.ScheduledTask | null = null;
let reactivationJob: cron.ScheduledTask | null = null;
let conversionJob: cron.ScheduledTask | null = null;

export function startScheduler() {
  if (process.env.NEXT_PUBLIC_SKIP_CRON === 'true') {
    console.log('[Scheduler] Cron jobs disabled via environment variable');
    return;
  }

  dailyJob = cron.schedule('0 9 * * *', async () => {
    console.log('[Scheduler] Running daily messages at 9 AM');
    try {
      await runAutomation('daily');
      console.log('[Scheduler] Daily messages completed');
    } catch (error) {
      console.error('[Scheduler] Daily messages failed:', error);
    }
  });

  reactivationJob = cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Running hourly reactivation check');
    try {
      await runAutomation('reactivation');
      console.log('[Scheduler] Reactivation messages completed');
    } catch (error) {
      console.error('[Scheduler] Reactivation messages failed:', error);
    }
  });

  conversionJob = cron.schedule('0 */2 * * *', async () => {
    console.log('[Scheduler] Running 2-hourly conversion check');
    try {
      await runAutomation('conversion');
      console.log('[Scheduler] Conversion messages completed');
    } catch (error) {
      console.error('[Scheduler] Conversion messages failed:', error);
    }
  });

  console.log('[Scheduler] All cron jobs started');
  console.log('[Scheduler] Daily: 9 AM, Reactivation: hourly, Conversion: every 2 hours');
}

export function stopScheduler() {
  if (dailyJob) {
    dailyJob.stop();
    dailyJob = null;
  }
  if (reactivationJob) {
    reactivationJob.stop();
    reactivationJob = null;
  }
  if (conversionJob) {
    conversionJob.stop();
    conversionJob = null;
  }
  console.log('[Scheduler] All cron jobs stopped');
}

export function getSchedulerStatus() {
  return {
    daily: dailyJob !== null,
    reactivation: reactivationJob !== null,
    conversion: conversionJob !== null
  };
}
