import type {
  ContactMessage,
  DvarTorah,
  Event,
  Lecture,
  SiteContentBlock,
} from "./schema";

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

/** Source/sync defaults for demo rows (real content is imported from YouTube). */
const noSource = {
  sourceVideoId: null,
  sourcePlatform: "youtube",
  categorySlug: null,
  subcategorySlug: null,
  needsReview: false,
  metadata: {},
} as const;

/** Video/source defaults for demo divrei-torah rows. */
const dvarVideoDefaults = {
  parashaSlug: null,
  contentType: "video",
  mediaUrl: null,
  thumbnailUrl: null,
  durationMinutes: null,
  sourceVideoId: null,
  sourcePlatform: "youtube",
  metadata: {},
} as const;

export const sampleLectures: Lecture[] = [
  {
    ...noSource,
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
    ...noSource,
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
    ...noSource,
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
    ...noSource,
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
    ...noSource,
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
    ...noSource,
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
    ...dvarVideoDefaults,
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
    ...dvarVideoDefaults,
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
    ...dvarVideoDefaults,
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
      he: "הרב ינון קלזאן הוא מרצה לפילוסופיה יהודית ומחשבת ישראל, ומן המרצים הבולטים בארגון „ערכים”. הוא פועל בעיקר בקהילות היהודיות בארצות הברית ומכונה „המרצה העולמי מארה״ב”, לצד מסעות הרצאות ברחבי ישראל והעולם.\n\nמשנתו מאופיינת בכמות גדושה של מידע אותנטי הנשען ישירות על המקורות — תנ״ך, משנה, גמרא, מדרש וקבלה — לצד גישה רציונלית-לוגית המנתחת כל נושא לעומקו. הרצאותיו מקשרות בין חכמת התורה הקדומה לבין שאלות הזמן והמציאות העכשווית.\n\nלאורך השנים העביר הרב קלזאן מאות הרצאות במגוון רחב של תחומים: תורה מן השמים ונפש האדם, קבלה ומיסטיקה יהודית, פרשות השבוע ותנ״ך, טעמי המצוות והחגים, אחרית הימים ותהליך הגאולה, וכן זוגיות, חינוך ופיתוח האישיות. ההרצאות זמינות בווידאו ובאודיו במגוון פלטפורמות. בשנת תשפ״ד ערך מסע הרצאות חיזוק ברחבי הארץ, ובכללן ברמת גן, אשדוד, הרצליה, מודיעין, ראש העין, חיפה וירושלים.",
      en: "Rabbi Yinon Kalazan is a lecturer in Jewish philosophy and Jewish thought, and one of the leading speakers of the “Arachim” organization. He is based primarily among Jewish communities in the United States — where he is known as “the global lecturer from the USA” — alongside lecture tours across Israel and around the world.\n\nHis teaching is marked by a wealth of authentic information drawn directly from the sources — Bible, Mishnah, Talmud, Midrash and Kabbalah — together with a rational, logical approach that analyzes each subject in depth. His lectures connect the ancient wisdom of the Torah to the questions of our time and to contemporary reality.\n\nOver the years Rabbi Kalazan has delivered hundreds of lectures across a wide range of fields: Torah from Heaven and the human soul, Kabbalah and Jewish mysticism, the weekly Torah portion and the Bible, the reasons behind the commandments and the festivals, the End of Days and the process of redemption, as well as marriage, education and personal development. His lectures are available in video and audio on a variety of platforms. In 5784 (2024) he held a tour of strengthening lectures throughout Israel, including in Ramat Gan, Ashdod, Herzliya, Modiin, Rosh HaAyin, Haifa and Jerusalem.",
    },
    updatedAt: d("2026-07-07T12:00:00Z"),
  },
  {
    key: "about-vision",
    title: { he: "החזון", en: "The Vision" },
    body: {
      he: "שאיפתו של הרב קלזאן היא לחזק את התודעה היהודית, לעצור את ההתבוללות התרבותית והמעשית, ולהשיב ליהודים את האמון והגאווה במורשתם — מתוך חשיפת העומק, החכמה והיופי שביהדות. המוטו המלווה את עשייתו: „האזינו, החכימו, והפיצו”.",
      en: "Rabbi Kalazan’s aspiration is to strengthen Jewish consciousness, to halt cultural and practical assimilation, and to restore to the Jewish people their trust and pride in their heritage — by revealing the depth, wisdom and beauty of Judaism. The motto that accompanies his work: “Listen, learn, and spread the word”.",
    },
    updatedAt: d("2026-07-07T12:00:00Z"),
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

export const sampleContactMessages: ContactMessage[] = [
  {
    id: "msg-warm-words",
    name: "אליהו כהן",
    email: "eliyahu@example.com",
    phone: null,
    subject: null,
    category: "rabbi",
    message:
      "רציתי להודות לרב על השיעורים המרתקים. כל הרצאה פותחת לי עולם חדש במחשבת ישראל. תודה רבה על העבודה הקדושה!",
    handled: false,
    createdAt: d("2026-07-04T09:15:00Z"),
  },
  {
    id: "msg-site-feedback",
    name: "Sarah Levi",
    email: "sarah.levi@example.com",
    phone: null,
    subject: null,
    category: "site",
    message:
      "The new website looks beautiful. One small note — it would be great to have a search box for the lectures. Keep up the great work!",
    handled: true,
    createdAt: d("2026-07-02T18:40:00Z"),
  },
  {
    id: "msg-general",
    name: "משפחת אברהמי",
    email: null,
    phone: "052-9876543",
    subject: null,
    category: "general",
    message:
      "האם ניתן להזמין את הרב להרצאה בקהילה שלנו בחודש הבא? נשמח לתאם. אפשר לחזור אלינו לטלפון.",
    handled: false,
    createdAt: d("2026-06-28T20:05:00Z"),
  },
];
