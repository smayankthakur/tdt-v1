/**
 * Output cleanup utilities for tarot readings
 * Ensures non-duplicative, clean, human-like responses
 */

/**
 * Remove duplicate consecutive paragraphs from text
 */
export function removeDuplicateParagraphs(text: string): string {
  if (!text) return text;

  const parts = text.split('\n');
  const uniqueParts = [];
  let lastPart = '';

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed && trimmed !== lastPart) {
      uniqueParts.push(part);
      lastPart = trimmed;
    } else if (!trimmed) {
      // Keep empty lines for spacing
      uniqueParts.push(part);
    }
  }

  return uniqueParts.join('\n');
}

/**
 * Replace all occurrences of "seeker" (case-insensitive) with the user's name
 */
export function replaceSeekerWithName(text: string, name: string): string {
  if (!text || !name) return text;
  return text.replace(/\bseeker\b/gi, name);
}

/**
 * Full cleanup pipeline: deduplication + personalization + trim
 */
export function cleanupReadingOutput(
  text: string,
  userName: string,
  firstName: string
): string {
  let output = text;

  // Step 1: Remove duplicate paragraphs
  output = removeDuplicateParagraphs(output);

  // Step 2: Replace "seeker" with actual first name
  output = replaceSeekerWithName(output, firstName);

  // Step 3: Trim whitespace
  output = output.trim();

  return output;
}

/**
 * Extract first name from full name
 */
export function extractFirstName(fullName: string): string {
  if (!fullName) return '';
  return fullName.trim().split(' ')[0];
}
