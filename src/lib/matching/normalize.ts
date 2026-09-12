const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "has",
  "have", "had", "was", "were", "will", "with", "this", "that", "from",
  "your", "our", "their", "they", "them", "who", "what", "when", "where",
  "why", "how", "which", "these", "those", "into", "onto", "than", "then",
  "them", "such", "some", "more", "most", "other", "each", "every", "any",
  "about", "after", "before", "over", "under", "again", "further", "once",
  "here", "there", "should", "would", "could", "must", "shall", "does",
  "did", "doing", "being", "been", "were", "while", "during", "including",
  "role", "work", "team", "years", "experience", "job", "company",
  "ability", "strong", "including", "using",
]);

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word / whole-phrase match, case-insensitive, that also treats
 * punctuation-adjacent terms correctly (so "C++" or "Node.js" aren't
 * required to sit between plain word-boundary characters).
 */
export function containsKeyword(lowerText: string, term: string): boolean {
  const escaped = escapeRegExp(term.toLowerCase());
  const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
  return pattern.test(lowerText);
}

export function tokenizeSignificantWords(lowerText: string): string[] {
  return lowerText
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOPWORDS.has(word));
}
