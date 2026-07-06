/**
 * Lightweight bilingual (Hebrew + English) profanity guard.
 *
 * There is no good off-the-shelf npm library that covers Hebrew, so this is a
 * small, self-contained word list plus normalization. It runs in both the
 * client validation (react-hook-form + zod) and again server-side in the
 * contact action, so a blocked word never reaches the database.
 *
 * The goal is to catch obvious abuse, not to be a perfect filter — keep the
 * list tasteful and extend it as needed. Matching is whole-word (with word
 * boundaries) to avoid the "Scunthorpe problem" (innocent substrings).
 */

/** Hebrew / transliterated and English terms we refuse to store. */
const BLOCKED_TERMS: readonly string[] = [
  // Hebrew
  "זונה",
  "זונות",
  "שרמוטה",
  "כוס אמק",
  "כוסאמק",
  "כוסאמאק",
  "בן זונה",
  "בן זונא",
  "מזדיין",
  "מזדיינת",
  "תזדיין",
  "תזדייני",
  "לך תזדיין",
  "חתיכת חרא",
  "מניאק",
  "מניאקים",
  "דפוק",
  "מפגר",
  "מפגרת",
  "אידיוט",
  "כלבה",
  "נאצי",
  // English
  "fuck",
  "fucker",
  "motherfucker",
  "shit",
  "bullshit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "dick",
  "pussy",
  "whore",
  "slut",
  "retard",
  "nigger",
  "faggot",
];

/**
 * Normalize text for matching: lower-case, strip Hebrew niqqud (diacritics),
 * turn punctuation into spaces, and collapse runs of the same character to one
 * (so "shiiiit" → "shit"). Matching stays whole-word, so this only flags a term
 * when the collapsed word equals a blocked word.
 */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[֑-ׇ]/g, "") // Hebrew niqqud / cantillation
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // punctuation → space
    .replace(/(.)\1+/gu, "$1") // collapse repeated characters → one
    .replace(/\s+/g, " ")
    .trim();
}

/** Build a whole-word regex once per blocked term. */
const BLOCKED_PATTERNS: readonly RegExp[] = BLOCKED_TERMS.map((term) => {
  const normalizedTerm = normalize(term);
  const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // `\b` is unreliable across scripts, so anchor on start/space either side.
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`, "u");
});

/** True when the given text contains a blocked term. */
export function containsProfanity(text: string | null | undefined): boolean {
  if (!text) return false;
  const normalized = normalize(text);
  if (!normalized) return false;
  const spaced = ` ${normalized} `;
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(spaced));
}

/** Convenience: true when any of the provided fields contains a blocked term. */
export function anyContainsProfanity(
  ...fields: (string | null | undefined)[]
): boolean {
  return fields.some((field) => containsProfanity(field));
}
