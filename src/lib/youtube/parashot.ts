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
  { slug: "behar-bechukotai", he: "בהר בחקתי", en: "Behar-Bechukotai", aliases: ["בהר-בחוקתי"] },
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

/** Strip niqqud/gershayim and normalize whitespace for matching. */
function normHe(s: string): string {
  return s
    .replace(/[֑-ׇ]/g, "") // niqqud/te'amim
    .replace(/["'׳״]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const BY_HE = new Map<string, Parasha>();
for (const p of PARASHIOT) {
  BY_HE.set(normHe(p.he), p);
  for (const a of p.aliases ?? []) BY_HE.set(normHe(a), p);
}

/** Look up a parasha by its Hebrew name (tolerant of variants). */
export function findParashaHe(name: string): Parasha | null {
  return BY_HE.get(normHe(name)) ?? null;
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
  // Drop a trailing Hebrew-year suffix like "התשפ״ו" / "תשפה".
  const cleaned = raw.replace(/\s*ה?תש[א-ת]?["'׳״]?[א-ת]?\s*$/u, "").trim();
  return { parasha: findParashaHe(cleaned), rawParasha: cleaned || raw };
}
