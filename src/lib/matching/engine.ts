import { KEYWORD_VOCABULARY } from "@/lib/matching/vocabulary";
import { containsKeyword, tokenizeSignificantWords } from "@/lib/matching/normalize";

export interface MatchResult {
  score: number; // 0-100, our own estimate — never framed as an official ATS score
  matchedKeywords: string[];
  missingKeywords: string[];
}

const MIN_VOCAB_HITS_TO_TRUST = 3;
const VOCAB_WEIGHT = 0.75;
const GENERAL_WEIGHT = 0.25;

export function computeMatch(
  resumeText: string,
  jobDescriptionText: string
): MatchResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescriptionText.toLowerCase();

  const jdVocabHits = KEYWORD_VOCABULARY.filter((term) =>
    containsKeyword(jdLower, term)
  );
  const matchedKeywords = jdVocabHits.filter((term) =>
    containsKeyword(resumeLower, term)
  );
  const missingKeywords = jdVocabHits.filter(
    (term) => !containsKeyword(resumeLower, term)
  );

  const generalScore = generalOverlapScore(resumeLower, jdLower);

  let score: number;
  if (jdVocabHits.length >= MIN_VOCAB_HITS_TO_TRUST) {
    const vocabScore = matchedKeywords.length / jdVocabHits.length;
    score = Math.round(
      (vocabScore * VOCAB_WEIGHT + generalScore * GENERAL_WEIGHT) * 100
    );
  } else {
    // Too few recognizable skill/tool terms in the JD to trust vocabulary
    // matching alone — fall back to general significant-word overlap.
    score = Math.round(generalScore * 100);
  }

  return {
    score: clamp(score, 0, 100),
    matchedKeywords,
    missingKeywords,
  };
}

function generalOverlapScore(resumeLower: string, jdLower: string): number {
  const jdWords = new Set(tokenizeSignificantWords(jdLower));
  if (jdWords.size === 0) return 0;

  const resumeWords = new Set(tokenizeSignificantWords(resumeLower));
  let hits = 0;
  for (const word of jdWords) {
    if (resumeWords.has(word)) hits += 1;
  }
  return hits / jdWords.size;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
