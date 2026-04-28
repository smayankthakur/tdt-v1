export async function safeFetch(url: string, options?: RequestInit, retries = 2) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) throw new Error('Request failed');

    return res;
  } catch (err) {
    if (retries > 0) {
      return safeFetch(url, options, retries - 1);
    }

    // Log failure
    fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({
        type: 'fetch_error',
        url,
        error: String(err),
      }),
    }).catch(() => {});

    // Fallback response
    return new Response(JSON.stringify({ fallback: true }), { status: 200 });
  }
}