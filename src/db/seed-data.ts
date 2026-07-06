import type { DvarTorah, Event, Lecture, SiteContentBlock } from "./schema";

/**
 * Bundled sample content.
 *
 * Serves two roles:
 *  1. Fallback data the repositories return when no database is connected, so
 *     the site looks alive out of the box.
 *  2. The source for `db:seed`, which inserts these rows into Supabase.
 *
 * Ids double as slugs here for stable demo keys; the seed script lets the DB
 * generate real UUIDs.
 */

const d = (iso: string) => new Date(iso);

export const sampleLectures: Lecture[] = [
  {
    id: "emuna-vetvuna-rambam",
    slug: "emuna-vetvuna-rambam",
    title: { he: "אמונה ותבונה בתורת הרמב\"ם", en: "Faith and Reason in Maimonides" },
    description: {
      he: "בחינת היחס בין אמונה לבין השכל שכלית בתפיסת הרמב\"ם.",
      en: "Examining the relationship between faith and intellect in Maimonides' thought.",
    },
    topic: { he: "פילוסופיה יהודית", en: "Jewish Philosophy" },
    series: { he: "יסודות האמונה", en: "Foundations of Faith" },
    contentType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: null,
    durationMinutes: 75,
    featured: true,
    published: true,
    sortOrder: 1,
    publishedAt: d("2025-05-12T18:00:00Z"),
    createdAt: d("2025-05-12T18:00:00Z"),
    updatedAt: d("2025-05-12T18:00:00Z"),
  },
  {
    id: "cherut-haadam-rabbi-akiva",
    slug: "cherut-haadam-rabbi-akiva",
    title: { he: "חירות האדם במשנת רבי עקיבא", en: "Human Freedom in the Teaching of Rabbi Akiva" },
    description: {
      he: "עיון במושג החירות לאור דברי חז\"ל והשלכותיהם לחיי האדם.",
      en: "A study of freedom in light of the Sages and its implications for human life.",
    },
    topic: { he: "מחשבת ישראל", en: "Jewish Thought" },
    series: { he: "אישים במחשבת ישראל", en: "Figures in Jewish Thought" },
    contentType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: null,
    durationMinutes: 68,
    featured: true,
    published: true,
    sortOrder: 2,
    publishedAt: d("2025-04-28T18:00:00Z"),
    createdAt: d("2025-04-28T18:00:00Z"),
    updatedAt: d("2025-04-28T18:00:00Z"),
  },
  {
    id: "hashgacha-pratit",
    slug: "hashgacha-pratit",
    title: { he: "השגחה פרטית והנהגה אלוקית", en: "Divine Providence and Guidance" },
    description: {
      he: "דיון פילוסופי בשאלת ההשגחה הפרטית כפי שהיא עולה במקורות.",
      en: "A philosophical discussion of individual providence as it emerges in the sources.",
    },
    topic: { he: "אמונה ופילוסופיה", en: "Faith and Philosophy" },
    series: { he: "יסודות האמונה", en: "Foundations of Faith" },
    contentType: "audio",
    mediaUrl: "https://example.com/audio/hashgacha.mp3",
    thumbnailUrl: null,
    durationMinutes: 82,
    featured: false,
    published: true,
    sortOrder: 3,
    publishedAt: d("2025-04-10T18:00:00Z"),
    createdAt: d("2025-04-10T18:00:00Z"),
    updatedAt: d("2025-04-10T18:00:00Z"),
  },
  {
    id: "musar-umtziut-ramban",
    slug: "musar-umtziut-ramban",
    title: { he: "מוסר ומציאות – גישת הרמב\"ן", en: "Ethics and Reality — the Ramban's Approach" },
    description: {
      he: "הקשר בין מוסר לבין תפיסת המציאות בגישת הרמב\"ן.",
      en: "The link between ethics and the perception of reality in the Ramban's approach.",
    },
    topic: { he: "פילוסופיה יהודית", en: "Jewish Philosophy" },
    series: { he: "אישים במחשבת ישראל", en: "Figures in Jewish Thought" },
    contentType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: null,
    durationMinutes: 60,
    featured: false,
    published: true,
    sortOrder: 4,
    publishedAt: d("2025-03-22T18:00:00Z"),
    createdAt: d("2025-03-22T18:00:00Z"),
    updatedAt: d("2025-03-22T18:00:00Z"),
  },
  {
    id: "tachlit-haadam-chassidut",
    slug: "tachlit-haadam-chassidut",
    title: { he: "תכלית האדם לפי תורת החסידות", en: "The Purpose of Man in Chassidic Thought" },
    description: {
      he: "עיון במטרת האדם בעולם לפי תורת חסידות חב\"ד והשלכותיה.",
      en: "A study of man's purpose in the world according to Chabad Chassidut.",
    },
    topic: { he: "חסידות", en: "Chassidut" },
    series: { he: "נפש האדם", en: "The Human Soul" },
    contentType: "audio",
    mediaUrl: "https://example.com/audio/tachlit.mp3",
    thumbnailUrl: null,
    durationMinutes: 70,
    featured: false,
    published: true,
    sortOrder: 5,
    publishedAt: d("2025-03-08T18:00:00Z"),
    createdAt: d("2025-03-08T18:00:00Z"),
    updatedAt: d("2025-03-08T18:00:00Z"),
  },
  {
    id: "tzelem-elokim",
    slug: "tzelem-elokim",
    title: { he: "צלם אלוקים – כבוד האדם ותכליתו", en: "The Image of God — Human Dignity and Purpose" },
    description: {
      he: "משמעות היות האדם נברא בצלם, וההשלכות המוסריות של רעיון זה.",
      en: "The meaning of being created in God's image and its moral implications.",
    },
    topic: { he: "מחשבת ישראל", en: "Jewish Thought" },
    series: { he: "נפש האדם", en: "The Human Soul" },
    contentType: "article",
    mediaUrl: null,
    thumbnailUrl: null,
    durationMinutes: null,
    featured: false,
    published: true,
    sortOrder: 6,
    publishedAt: d("2025-02-18T18:00:00Z"),
    createdAt: d("2025-02-18T18:00:00Z"),
    updatedAt: d("2025-02-18T18:00:00Z"),
  },
];

export const sampleDivreiTorah: DvarTorah[] = [
  {
    id: "bereshit-reshit",
    slug: "bereshit-reshit",
    title: { he: "בראשית – ההתחלה שבכל יום", en: "Bereshit — The Beginning Within Every Day" },
    parasha: { he: "בראשית", en: "Bereshit" },
    excerpt: {
      he: "כיצד רעיון הבריאה מלמד אותנו על התחדשות מתמדת בחיי היום-יום.",
      en: "How the idea of creation teaches us about constant renewal in daily life.",
    },
    body: {
      he: "פרשת בראשית פותחת את התורה ברעיון הבריאה. אך מעבר לסיפור ההיסטורי, טמון כאן מסר עמוק על היכולת להתחיל מחדש בכל רגע…",
      en: "Parashat Bereshit opens the Torah with the idea of creation. Beyond the historical account lies a deep message about the ability to begin anew at every moment…",
    },
    featured: true,
    published: true,
    publishedAt: d("2025-10-17T12:00:00Z"),
    createdAt: d("2025-10-17T12:00:00Z"),
    updatedAt: d("2025-10-17T12:00:00Z"),
  },
  {
    id: "lech-lecha-masa",
    slug: "lech-lecha-masa",
    title: { he: "לך לך – המסע אל העצמי", en: "Lech Lecha — The Journey to the Self" },
    parasha: { he: "לך לך", en: "Lech Lecha" },
    excerpt: {
      he: "הציווי 'לך לך' כקריאה למסע פנימי של גילוי עצמי ואמונה.",
      en: "The command 'Lech Lecha' as a call to an inner journey of self-discovery and faith.",
    },
    body: {
      he: "'לך לך מארצך וממולדתך' — הציווי הראשון לאברהם אבינו אינו רק מסע גיאוגרפי, אלא מסע אל עומק הנפש…",
      en: "'Go forth from your land' — the first command to Abraham is not merely a geographical journey, but a journey into the depths of the soul…",
    },
    featured: false,
    published: true,
    publishedAt: d("2025-10-31T12:00:00Z"),
    createdAt: d("2025-10-31T12:00:00Z"),
    updatedAt: d("2025-10-31T12:00:00Z"),
  },
  {
    id: "vayera-hachnasat-orchim",
    slug: "vayera-hachnasat-orchim",
    title: { he: "וירא – גדולה הכנסת אורחים", en: "Vayera — The Greatness of Hospitality" },
    parasha: { he: "וירא", en: "Vayera" },
    excerpt: {
      he: "מה מלמד אותנו אברהם על ערך החסד וקבלת פני הזולת.",
      en: "What Abraham teaches us about the value of kindness and welcoming others.",
    },
    body: {
      he: "אברהם אבינו, שלושה ימים לאחר בריתו, יושב בפתח האוהל ומחפש אורחים. מכאן למדו חכמים שגדולה הכנסת אורחים מהקבלת פני שכינה…",
      en: "Abraham, three days after his covenant, sits at the entrance of his tent seeking guests. From here the Sages learned that hospitality is greater than receiving the Divine Presence…",
    },
    featured: false,
    published: true,
    publishedAt: d("2025-11-07T12:00:00Z"),
    createdAt: d("2025-11-07T12:00:00Z"),
    updatedAt: d("2025-11-07T12:00:00Z"),
  },
];

export const sampleEvents: Event[] = [
  {
    id: "kenes-machshava-2026",
    slug: "kenes-machshava-2026",
    title: { he: "כנס מחשבת ישראל השנתי", en: "Annual Jewish Thought Conference" },
    description: {
      he: "יום עיון בנושאי אמונה, פילוסופיה ומחשבת ישראל, בהשתתפות מרצים אורחים.",
      en: "A day of study on faith, philosophy and Jewish thought, with guest speakers.",
    },
    location: { he: "ירושלים", en: "Jerusalem" },
    registrationUrl: "https://example.com/register",
    imageUrl: null,
    published: true,
    startsAt: d("2026-08-20T16:00:00Z"),
    endsAt: d("2026-08-20T21:00:00Z"),
    createdAt: d("2026-06-01T12:00:00Z"),
    updatedAt: d("2026-06-01T12:00:00Z"),
  },
  {
    id: "shiur-shavui-elul",
    slug: "shiur-shavui-elul",
    title: { he: "סדרת שיעורי אלול", en: "Elul Lecture Series" },
    description: {
      he: "סדרת שיעורים שבועיים לקראת הימים הנוראים, בנושאי תשובה וחשבון נפש.",
      en: "A weekly lecture series ahead of the High Holy Days on repentance and introspection.",
    },
    location: { he: "תל אביב", en: "Tel Aviv" },
    registrationUrl: "https://example.com/register",
    imageUrl: null,
    published: true,
    startsAt: d("2026-09-03T17:30:00Z"),
    endsAt: null,
    createdAt: d("2026-07-01T12:00:00Z"),
    updatedAt: d("2026-07-01T12:00:00Z"),
  },
];

export const sampleSiteContent: SiteContentBlock[] = [
  {
    key: "about-bio",
    title: { he: "על הרב ינון קלזאן", en: "About Rabbi Yinon Kalazan" },
    body: {
      he: "הרב ינון קלזאן הוא מרצה לפילוסופיה יהודית ומחשבת ישראל, המשלב בהוראתו עומק מחשבתי עם נגישות ובהירות. שיעוריו והרצאותיו עוסקים ביסודות האמונה, בפילוסופיה יהודית ובהגות לאורך הדורות.",
      en: "Rabbi Yinon Kalazan is a lecturer in Jewish philosophy and Jewish thought, combining intellectual depth with accessibility and clarity. His classes and lectures address the foundations of faith, Jewish philosophy and thought throughout the generations.",
    },
    updatedAt: d("2026-01-01T12:00:00Z"),
  },
  {
    key: "about-vision",
    title: { he: "החזון", en: "The Vision" },
    body: {
      he: "להנגיש את עומקה של מחשבת ישראל לכל אדם, ולהפוך את תורת ההשקפה למצפן מעשי לחיים.",
      en: "To make the depth of Jewish thought accessible to everyone, turning a worldview into a practical compass for life.",
    },
    updatedAt: d("2026-01-01T12:00:00Z"),
  },
  {
    key: "support-intro",
    title: { he: "תמיכה בעבודה שלנו", en: "Support Our Work" },
    body: {
      he: "התרומה שלכם מאפשרת להמשיך ולהפיץ תורה, לקיים הרצאות ולפתח תכנים חדשים לזיכוי הרבים.",
      en: "Your contribution makes it possible to keep spreading Torah, holding lectures and developing new content for the benefit of all.",
    },
    updatedAt: d("2026-01-01T12:00:00Z"),
  },
];
