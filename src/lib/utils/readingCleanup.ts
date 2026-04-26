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
 * Remove duplicate sentences from text (case-insensitive, handles punctuation)
 * Ensures each unique idea appears only once
 */
export function removeDuplicateSentences(text: string): string {
  if (!text) return text;

  // Split into sentences (handle . ! ? followed by space or end of string)
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text];
  
  if (sentences.length <= 1) return text;

  const seen = new Set<string>();
  const uniqueSentences: string[] = [];

  for (const sentence of sentences) {
    // Normalize: lowercase, trim, remove trailing punctuation for comparison
    const normalized = sentence.trim().toLowerCase().replace(/[.!?\s]+$/, '');
    
    // Skip if we've seen this exact sentence before
    if (!seen.has(normalized) && normalized.length > 5) {
      seen.add(normalized);
      uniqueSentences.push(sentence);
    }
    // For very short sentences, always keep them
    else if (normalized.length <= 5) {
      uniqueSentences.push(sentence);
    }
    // Otherwise skip duplicate
  }

  return uniqueSentences.join(' ').trim();
}

/**
 * Replace all occurrences of \"seeker\" (case-insensitive) with the user's name
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

  // Step 2: Remove duplicate sentences
  output = removeDuplicateSentences(output);

  // Step 3: Replace \"seeker\" with actual first name
  output = replaceSeekerWithName(output, firstName);

  // Step 4: Trim whitespace
  output = output.trim();

  return output;
}