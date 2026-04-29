export async function safeAIRequest(fn: () => Promise<any>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const result = await fn();
    return result;
  } catch (e) {
    await fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({
        type: 'ai_error',
        error: String(e),
      }),
    }).catch(() => {});

    return {
      fallback: true,
      message: 'Something felt incomplete… try asking again.',
    };
  } finally {
    clearTimeout(timeout);
  }
}