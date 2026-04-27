import { Resend } from 'resend';

/**
 * Safely creates a Resend client only when API key is available.
 * This function is called at runtime, never at module level.
 *
 * @returns Resend client or null if API key is missing
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}
