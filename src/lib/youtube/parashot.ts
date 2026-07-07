/**
 * Canonical table of the 54 weekly Torah portions (parashot) — Hebrew name,
 * stable slug, and English transliteration. Drives deterministic (no-AI)
 * tagging of "דבר תורה קצר לפרשת X" videos by their title.
 *
 * `aliases` covers spelling variants seen in real titles (spacing, final-letter
 * forms, combined portions).
 */
export interface Parasha {
  slug: string;
  he: string;
  en: string;
  aliases?: string[];
}

/** The five books of the Torah — used to group weekly portions into categories. */
export interface Chumash {
  slug: string;
  he: string;
  en: string;
}

export const CHUMASHIM: Chumash[] = [
  { slug: "bereshit", he: "בראשית", en: "Genesis" },
  { slug: "shemot", he: "שמות", en: "Exodus" },
  { slug: "vayikra", he: "ויקרא", en: "Leviticus" },
  { slug: "bamidbar", he: "במדבר", en: "Numbers" },
  { slug: "devarim", he: "דברים", en: "Deuteronomy" },
];

export const CHUMASH_BY_SLUG = new Map(CHUMASHIM.map((c) => [c.slug, c]));

export const PARASHIOT: Parasha[] = [
  // Bereshit
  { slug: "bereshit", he: "בראשית", en: "Bereshit" },
  { slug: "noach", he: "נח", en: "Noach", aliases: ["נוח"] },
  { slug: "lech-lecha", he: "לך לך", en: "Lech Lecha", aliases: ["לך-לך"] },
  { slug: "vayeira", he: "וירא", en: "Vayeira" },
  { slug: "chayei-sarah", he: "חיי שרה", en: "Chayei Sarah", aliases: ["חיי-שרה"] },
  { slug: "toldot", he: "תולדות", en: "Toldot" },
  { slug: "vayetze", he: "ויצא", en: "Vayetze" },
  { slug: "vayishlach", he: "וישלח", en: "Vayishlach" },
  { slug: "vayeshev", he: "וישב", en: "Vayeshev" },
  { slug: "miketz", he: "מקץ", en: "Miketz" },
  { slug: "vayigash", he: "ויגש", en: "Vayigash" },
  { slug: "vayechi", he: "ויחי", en: "Vayechi" },
  // Shemot
  { slug: "shemot", he: "שמות", en: "Shemot" },
  { slug: "vaeira", he: "וארא", en: "Vaeira" },
  { slug: "bo", he: "בא", en: "Bo" },
  { slug: "beshalach", he: "בשלח", en: "Beshalach" },
  { slug: "yitro", he: "יתרו", en: "Yitro" },
  { slug: "mishpatim", he: "משפטים", en: "Mishpatim" },
  { slug: "terumah", he: "תרומה", en: "Terumah" },
  { slug: "tetzaveh", he: "תצוה", en: "Tetzaveh", aliases: ["תצווה"] },
  { slug: "ki-tisa", he: "כי תשא", en: "Ki Tisa", aliases: ["כי-תשא"] },
  { slug: "vayakhel", he: "ויקהל", en: "Vayakhel" },
  { slug: "pekudei", he: "פקודי", en: "Pekudei" },
  { slug: "vayakhel-pekudei", he: "ויקהל פקודי", en: "Vayakhel-Pekudei", aliases: ["פקודי ויקהל", "ויקהל-פקודי"] },
  // Vayikra
  { slug: "vayikra", he: "ויקרא", en: "Vayikra" },
  { slug: "tzav", he: "צו", en: "Tzav" },
  { slug: "shemini", he: "שמיני", en: "Shemini" },
  { slug: "tazria", he: "תזריע", en: "Tazria" },
  { slug: "metzora", he: "מצורע", en: "Metzora" },
  { slug: "tazria-metzora", he: "תזריע מצורע", en: "Tazria-Metzora", aliases: ["תזריע-מצורע"] },
  { slug: "acharei-mot", he: "אחרי מות", en: "Acharei Mot", aliases: ["אחרי-מות", "אחרי"] },
  { slug: "kedoshim", he: "קדושים", en: "Kedoshim" },
  { slug: "acharei-mot-kedoshim", he: "אחרי מות קדושים", en: "Acharei Mot-Kedoshim" },
  { slug: "emor", he: "אמור", en: "Emor" },
  { slug: "behar", he: "בהר", en: "Behar" },
  { slug: "bechukotai", he: "בחקתי", en: "Bechukotai", aliases: ["בחוקתי", "בחוקותי"] },
  { slug: "behar-bechukotai", he: "בהר בחקתי", en: "Behar-Bechukotai", aliases: ["בהר בחוקתי", "בהר בחוקותי"] },
  // Bamidbar
  { slug: "bamidbar", he: "במדבר", en: "Bamidbar" },
  { slug: "naso", he: "נשא", en: "Naso" },
  { slug: "behaalotecha", he: "בהעלותך", en: "Behaalotecha" },
  { slug: "shlach", he: "שלח", en: "Shlach", aliases: ["שלח לך", "שלח-לך"] },
  { slug: "korach", he: "קרח", en: "Korach", aliases: ["קורח"] },
  { slug: "chukat", he: "חקת", en: "Chukat", aliases: ["חוקת"] },
  { slug: "balak", he: "בלק", en: "Balak" },
  { slug: "chukat-balak", he: "חקת בלק", en: "Chukat-Balak" },
  { slug: "pinchas", he: "פינחס", en: "Pinchas", aliases: ["פנחס"] },
  { slug: "matot", he: "מטות", en: "Matot" },
  { slug: "masei", he: "מסעי", en: "Masei" },
  { slug: "matot-masei", he: "מטות מסעי", en: "Matot-Masei", aliases: ["מטות-מסעי"] },
  // Devarim
  { slug: "devarim", he: "דברים", en: "Devarim" },
  { slug: "vaetchanan", he: "ואתחנן", en: "Vaetchanan" },
  { slug: "eikev", he: "עקב", en: "Eikev" },
  { slug: "reeh", he: "ראה", en: "Re'eh", aliases: ["ראה"] },
  { slug: "shoftim", he: "שופטים", en: "Shoftim" },
  { slug: "ki-teitzei", he: "כי תצא", en: "Ki Teitzei", aliases: ["כי-תצא"] },
  { slug: "ki-tavo", he: "כי תבא", en: "Ki Tavo", aliases: ["כי תבוא", "כי-תבא"] },
  { slug: "nitzavim", he: "נצבים", en: "Nitzavim", aliases: ["ניצבים"] },
  { slug: "vayelech", he: "וילך", en: "Vayelech" },
  { slug: "nitzavim-vayelech", he: "נצבים וילך", en: "Nitzavim-Vayelech" },
  { slug: "haazinu", he: "האזינו", en: "Haazinu" },
  { slug: "vezot-haberachah", he: "וזאת הברכה", en: "Vezot Haberachah", aliases: ["וזאת-הברכה"] },
];

/** Strip niqqud/gershayim, treat hyphens as spaces, normalize whitespace. */
function normHe(s: string): string {
  return s
    .replace(/[֑-ׇ]/g, "") // niqqud/te'amim
    .replace(/["'׳״]/g, "")
    .replace(/[-–—]/g, " ") // combined portions: "בהר-בחוקותי" → "בהר בחוקותי"
    .replace(/\s+/g, " ")
    .trim();
}

const BY_HE = new Map<string, Parasha>();
/** [normalizedName, parasha] pairs, longest name first — for prefix matching. */
const NAME_ENTRIES: Array<[string, Parasha]> = [];
for (const p of PARASHIOT) {
  for (const name of [p.he, ...(p.aliases ?? [])]) {
    const n = normHe(name);
    BY_HE.set(n, p);
    NAME_ENTRIES.push([n, p]);
  }
}
NAME_ENTRIES.sort((a, b) => b[0].length - a[0].length);

/**
 * Strip the noise that real titles append after the parasha name: the author
 * credit ("- הרב ינון קלזאן") and a Hebrew year ("התשפ״ו" / "תשפ"ה").
 */
function stripParashaNoise(text: string): string {
  return text
    .replace(/\s*[-–—]\s*(?:ה?רב\b.*)$/u, "") // "- הרב ינון קלזאן ..."
    .replace(/\s+ה?תש[א-ת]?["'׳״]?[א-ת]?\s*$/u, "") // trailing Hebrew year
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolve a parasha from free text: exact match first, then the longest known
 * parasha name that the text begins with (so "שלח לך התשפו" → Shlach,
 * "פינחס הרב..." → Pinchas). Tolerant of niqqud/gershayim/spacing.
 */
export function matchParasha(text: string): Parasha | null {
  const n = normHe(stripParashaNoise(text));
  if (!n) return null;
  const exact = BY_HE.get(n);
  if (exact) return exact;
  for (const [name, p] of NAME_ENTRIES) {
    if (n === name || n.startsWith(name + " ")) return p;
  }
  return null;
}

/** Look up a parasha by its Hebrew name (tolerant of variants). */
export function findParashaHe(name: string): Parasha | null {
  return matchParasha(name);
}

// Map each parasha slug → its book, derived from the canonical order above by
// advancing the "current book" pointer at each book's opening portion.
const BOOK_START_SLUGS = new Set(CHUMASHIM.map((c) => c.slug));
const PARASHA_BOOK = new Map<string, Chumash>();
{
  let current: Chumash = CHUMASHIM[0];
  for (const p of PARASHIOT) {
    if (BOOK_START_SLUGS.has(p.slug)) current = CHUMASH_BY_SLUG.get(p.slug)!;
    PARASHA_BOOK.set(p.slug, current);
  }
}

/** The book (chumash) a parasha slug belongs to. */
export function parashaBook(slug: string | null | undefined): Chumash | null {
  if (!slug) return null;
  return PARASHA_BOOK.get(slug) ?? null;
}

// Canonical reading order: index of each parasha within the yearly cycle.
const PARASHA_ORDER = new Map(PARASHIOT.map((p, i) => [p.slug, i]));

/**
 * The reading-order index of a parasha (0 = Bereshit … 53 = Vezot Haberachah),
 * resolved from its slug or free-text Hebrew name. Returns a large sentinel so
 * unknown portions sort last.
 */
export function parashaOrder(
  slug: string | null | undefined,
  name?: string | null,
): number {
  const bySlug = slug ? PARASHA_ORDER.get(slug) : undefined;
  if (bySlug != null) return bySlug;
  const p = name ? matchParasha(name) : null;
  const byName = p ? PARASHA_ORDER.get(p.slug) : undefined;
  return byName ?? 999;
}

/** Resolve a parasha's book from either its slug or its free-text Hebrew name. */
export function resolveBook(
  slug: string | null | undefined,
  name?: string | null,
): Chumash | null {
  const bySlug = parashaBook(slug);
  if (bySlug) return bySlug;
  const p = name ? matchParasha(name) : null;
  return p ? parashaBook(p.slug) : null;
}

const DVAR_TITLE_RE = /דבר\s*תורה\s*(?:קצר\s*)?(?:ל?פרשת|ל?פרשה)\s+(.+?)\s*$/;

/**
 * Detect a weekly "dvar torah" video from its title and extract the parasha.
 * Returns null if the title is not a dvar-torah item.
 */
export function detectDvarTorah(title: string): { parasha: Parasha | null; rawParasha: string } | null {
  const t = title.trim();
  if (!/דבר\s*תורה/.test(t)) return null;
  const m = DVAR_TITLE_RE.exec(t);
  const raw = m ? m[1] : "";
  const cleaned = stripParashaNoise(raw);
  return { parasha: matchParasha(raw), rawParasha: cleaned || raw };
}
