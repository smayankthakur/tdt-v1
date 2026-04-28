export function logPerf(metric: string, value: number) {
  fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({
      type: 'performance',
      metric,
      value,
      ts: Date.now(),
    }),
  }).catch(() => {});
}