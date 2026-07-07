/**
 * Canonical lecture taxonomy — the 15 categories and their sub-categories, as
 * scraped from the original site. The single source of truth for the manual
 * tagging UI (category/sub-category dropdowns) and for grouping lectures.
 *
 * `slug` is the stable machine key stored on each lecture (`categorySlug` /
 * `subcategorySlug`); `title` is the bilingual display label.
 */
import type { LocalizedText } from "@/lib/localized";

export interface TaxonomyNode {
  slug: string;
  title: LocalizedText;
}

export interface TaxonomyCategory extends TaxonomyNode {
  subcategories: TaxonomyNode[];
}

export const LECTURE_TAXONOMY: TaxonomyCategory[] = [
  {
    slug: "assimilation-future-of-the-jewish-people",
    title: { he: "התבוללות - עתיד העם היהודי", en: "Assimilation & the Future of the Jewish People" },
    subcategories: [],
  },
  {
    slug: "end-of-days",
    title: { he: "אחרית הימים", en: "The End of Days" },
    subcategories: [],
  },
  {
    slug: "israel",
    title: { he: "ישראל ואומות העולם", en: "Israel & the Nations" },
    subcategories: [],
  },
  {
    slug: "jewish-prophets",
    title: { he: "הנביאים", en: "The Prophets" },
    subcategories: [],
  },
  {
    slug: "judaism-christianity-islam",
    title: { he: "יהדות, נצרות ואיסלאם", en: "Judaism, Christianity & Islam" },
    subcategories: [],
  },
  {
    slug: "other-topics",
    title: { he: "נושאים נוספים", en: "Other Topics" },
    subcategories: [],
  },
  {
    slug: "prayer",
    title: { he: "תפילה", en: "Prayer" },
    subcategories: [
      { slug: "birkat-hamazon", title: { he: "ברכת המזון", en: "Birkat Hamazon" } },
      { slug: "kadish", title: { he: "קדיש", en: "Kadish" } },
      { slug: "psalms", title: { he: "תהילים", en: "Psalms" } },
      { slug: "shema-israel", title: { he: "שמע ישראל", en: "Shema Israel" } },
      { slug: "shemona-esrei-amidah-prayer", title: { he: "שמונה עשרה", en: "Shemona Esrei Amidah Prayer" } },
      { slug: "tefilat-haparnasa-rosh-hashanah", title: { he: "תפילת הפרנסה", en: "Tefilat Haparnasa Rosh Hashanah" } },
      { slug: "tefillah-prayer", title: { he: "תפילה", en: "Tefillah Prayer" } },
    ],
  },
  {
    slug: "relationships-children-education",
    title: { he: "זוגיות וחינוך ילדים", en: "Relationships & Raising Children" },
    subcategories: [
      { slug: "children-education", title: { he: "חינוך ילדים", en: "Children Education" } },
      { slug: "human-relations", title: { he: "יחסי אנוש", en: "Human Relations" } },
      { slug: "love", title: { he: "אהבה", en: "Love" } },
      { slug: "relationships", title: { he: "זוגיות", en: "Relationships" } },
      { slug: "the-jewish-home", title: { he: "הבית היהודי", en: "The Jewish Home" } },
    ],
  },
  {
    slug: "shabbat-holidays",
    title: { he: "שבת, חגים ומועדים", en: "Shabbat & Holidays" },
    subcategories: [
      { slug: "counting-of-the-omer", title: { he: "ספירת העומר", en: "Counting of the Omer" } },
      { slug: "eighth-of-tavet", title: { he: "ח׳ בטבת", en: "Eighth of Tavet" } },
      { slug: "hanukkah", title: { he: "חנוכה", en: "Hanukkah" } },
      { slug: "israeli-independence-day", title: { he: "יום העצמאות", en: "Israeli Independence Day" } },
      { slug: "lag-baomer", title: { he: "לג' בעומר", en: "Lag Baomer" } },
      { slug: "month-of-adar", title: { he: "אדר", en: "Month of Adar" } },
      { slug: "month-of-elul", title: { he: "חודש אלול", en: "Month of Elul" } },
      { slug: "month-of-nissan", title: { he: "ניסן", en: "Month of Nissan" } },
      { slug: "month-of-tishrei", title: { he: "תשרי", en: "Month of Tishrei" } },
      { slug: "passover", title: { he: "פסח", en: "Passover" } },
      { slug: "purim", title: { he: "פורים", en: "Purim" } },
      { slug: "rosh-chodesh-menachem-av", title: { he: "ראש חודש מנחם אב", en: "Rosh Chodesh Menachem Av" } },
      { slug: "rosh-chodesh", title: { he: "ראש חודש", en: "Rosh Chodesh" } },
      { slug: "rosh-hashanah", title: { he: "ראש השנה", en: "Rosh Hashanah" } },
      { slug: "shabbat-hagadol", title: { he: "שבת הגדול", en: "Shabbat Hagadol" } },
      { slug: "shabbat", title: { he: "שבת", en: "Shabbat" } },
      { slug: "shavuot", title: { he: "שבועות", en: "Shavuot" } },
      { slug: "sukkot", title: { he: "סוכות", en: "Sukkot" } },
      { slug: "ten-days-of-repentance", title: { he: "עשרת ימי תשובה", en: "Ten Days of Repentance" } },
      { slug: "the-tenth-of-tavet", title: { he: "עשרה בטבת", en: "The Tenth of Tavet" } },
      { slug: "tisha-bav", title: { he: "תשעה באב", en: "Tisha Bav" } },
      { slug: "tu-bishvat", title: { he: "טו' בשבט", en: "Tu Bishvat" } },
      { slug: "yom-kippur", title: { he: "יום הכיפורים", en: "Yom Kippur" } },
    ],
  },
  {
    slug: "tanakh-and-current-affairs",
    title: { he: "תנ\"ך ואקטואליה", en: "Tanakh & Current Affairs" },
    subcategories: [],
  },
  {
    slug: "thirteen-principles-of-jewish-faith",
    title: { he: "שלש עשרה עיקרים", en: "The Thirteen Principles of Faith" },
    subcategories: [
      { slug: "introduction-to-the-thirteen-principles-of-jewish-faith", title: { he: "מבוא", en: "Introduction to the Thirteen Principles of Jewish Faith" } },
      { slug: "principle-1", title: { he: "היסוד הראשון", en: "Principle 1" } },
      { slug: "principle-10", title: { he: "היסוד העשירי", en: "Principle 10" } },
      { slug: "principle-11", title: { he: "היסוד האחד עשר", en: "Principle 11" } },
      { slug: "principle-12", title: { he: "היסוד השנים עשר", en: "Principle 12" } },
      { slug: "principle-13", title: { he: "היסוד השלושה עשר", en: "Principle 13" } },
      { slug: "principle-2", title: { he: "היסוד השני", en: "Principle 2" } },
      { slug: "principle-3", title: { he: "היסוד השלישי", en: "Principle 3" } },
      { slug: "principle-4", title: { he: "היסוד הרביעי", en: "Principle 4" } },
      { slug: "principle-5", title: { he: "היסוד החמישי", en: "Principle 5" } },
      { slug: "principle-6", title: { he: "היסוד השישי", en: "Principle 6" } },
      { slug: "principle-7", title: { he: "היסוד השביעי", en: "Principle 7" } },
      { slug: "principle-8", title: { he: "היסוד השמיני", en: "Principle 8" } },
      { slug: "principle-9", title: { he: "היסוד התשיעי", en: "Principle 9" } },
    ],
  },
  {
    slug: "topics-in-jewish-philosophy",
    title: { he: "פילוסופיה יהודית", en: "Jewish Philosophy" },
    subcategories: [
      { slug: "astrology-and-judaism", title: { he: "אסטרולוגיה ויהדות", en: "Astrology and Judaism" } },
      { slug: "exile-of-the-erev-rav", title: { he: "גלות ה - ״ערב רב״", en: "Exile of the Erev Rav" } },
      { slug: "free-choice", title: { he: "בחירה החפשית", en: "Free Choice" } },
      { slug: "fulfilled-prophecies", title: { he: "נבואות שהתגשמו", en: "Fulfilled Prophecies" } },
      { slug: "history-according-to-judaism", title: { he: "ההיסטוריה על פי היהדות", en: "History According to Judaism" } },
      { slug: "humanism-and-judaism", title: { he: "הומניזם ויהדות", en: "Humanism and Judaism" } },
      { slug: "kabbalah", title: { he: "תורת הקבלה", en: "Kabbalah" } },
      { slug: "oral-torah", title: { he: "תורה שבעל פה", en: "Oral Torah" } },
      { slug: "others", title: { he: "עוד", en: "Others" } },
      { slug: "rationality-and-faith", title: { he: "רציונליות ואמונה", en: "Rationality and Faith" } },
      { slug: "reincarnation-of-the-dead-life-in-the-light-of-death", title: { he: "תחיית המתים/החיים לאור המוות", en: "Reincarnation of the Dead Life in the Light of Death" } },
      { slug: "righteous-suffer-wicked-prosper", title: { he: "צדיק ורע לו רשע וטוב לו", en: "Righteous Suffer Wicked Prosper" } },
      { slug: "teshuva", title: { he: "התשובה", en: "Teshuva" } },
      { slug: "the-first-mans-sin", title: { he: "חטא אדם הראשון", en: "The First Mans Sin" } },
      { slug: "the-mitzvot", title: { he: "המצוות", en: "The Mitzvot" } },
      { slug: "the-purpose-of-man-creation", title: { he: "תכלית האדם/הבריאה", en: "The Purpose of Man Creation" } },
      { slug: "the-status-of-women", title: { he: "מעמד האשה", en: "The Status of Women" } },
    ],
  },
  {
    slug: "topics-on-self-awareness",
    title: { he: "מודעות עצמית", en: "Self-Awareness" },
    subcategories: [
      { slug: "body-and-soul", title: { he: "גוף ונשמה", en: "Body and Soul" } },
      { slug: "others", title: { he: "אחרים", en: "Others" } },
      { slug: "personality-development", title: { he: "פיתוח האישיות", en: "Personality Development" } },
      { slug: "power-of-speech", title: { he: "כח הדיבור", en: "Power of Speech" } },
    ],
  },
  {
    slug: "weekly-torah-portion",
    title: { he: "פרשת השבוע", en: "Weekly Torah Portion" },
    subcategories: [
      { slug: "4-parashiot", title: { he: "ארבע פרשיות", en: "4 Parashiot" } },
      { slug: "sefer-bamidbar", title: { he: "ספר במדבר", en: "Sefer Bamidbar" } },
      { slug: "sefer-bereshit", title: { he: "ספר בראשית", en: "Sefer Bereshit" } },
      { slug: "sefer-devarim", title: { he: "ספר דברים", en: "Sefer Devarim" } },
      { slug: "sefer-shemot", title: { he: "ספר שמות", en: "Sefer Shemot" } },
      { slug: "sefer-vayikra", title: { he: "ספר ויקרא", en: "Sefer Vayikra" } },
    ],
  },
  {
    slug: "books-by-ramhal",
    title: { he: "ספרי הרמח\"ל", en: "The Works of the Ramchal" },
    subcategories: [
      { slug: "daat-tvunot", title: { he: "דעת תבונות", en: "Daat Tvunot" } },
      { slug: "derech-hashem", title: { he: "דרך השם", en: "Derech Hashem" } },
      { slug: "layesharim-tehila", title: { he: "לישרים תהילה", en: "Layesharim Tehila" } },
      { slug: "mesillat-yesharim", title: { he: "מסילת ישרים", en: "Mesillat Yesharim" } },
    ],
  },
];

/** Flat lookup: category slug → category. */
export const CATEGORY_BY_SLUG = new Map(LECTURE_TAXONOMY.map((c) => [c.slug, c]));

/** All category + sub-category slugs, for validation. */
export const ALL_CATEGORY_SLUGS = new Set(LECTURE_TAXONOMY.map((c) => c.slug));
