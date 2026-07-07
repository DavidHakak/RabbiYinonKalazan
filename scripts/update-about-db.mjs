import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const bio = {
  he: "הרב ינון קלזאן הוא מרצה לפילוסופיה יהודית ומחשבת ישראל, ומן המרצים הבולטים בארגון „ערכים”. הוא פועל בעיקר בקהילות היהודיות בארצות הברית ומכונה „המרצה העולמי מארה״ב”, לצד מסעות הרצאות ברחבי ישראל והעולם.\n\nמשנתו מאופיינת בכמות גדושה של מידע אותנטי הנשען ישירות על המקורות — תנ״ך, משנה, גמרא, מדרש וקבלה — לצד גישה רציונלית-לוגית המנתחת כל נושא לעומקו. הרצאותיו מקשרות בין חכמת התורה הקדומה לבין שאלות הזמן והמציאות העכשווית.\n\nלאורך השנים העביר הרב קלזאן מאות הרצאות במגוון רחב של תחומים: תורה מן השמים ונפש האדם, קבלה ומיסטיקה יהודית, פרשות השבוע ותנ״ך, טעמי המצוות והחגים, אחרית הימים ותהליך הגאולה, וכן זוגיות, חינוך ופיתוח האישיות. ההרצאות זמינות בווידאו ובאודיו במגוון פלטפורמות. בשנת תשפ״ד ערך מסע הרצאות חיזוק ברחבי הארץ, ובכללן ברמת גן, אשדוד, הרצליה, מודיעין, ראש העין, חיפה וירושלים.",
  en: "Rabbi Yinon Kalazan is a lecturer in Jewish philosophy and Jewish thought, and one of the leading speakers of the “Arachim” organization. He is based primarily among Jewish communities in the United States — where he is known as “the global lecturer from the USA” — alongside lecture tours across Israel and around the world.\n\nHis teaching is marked by a wealth of authentic information drawn directly from the sources — Bible, Mishnah, Talmud, Midrash and Kabbalah — together with a rational, logical approach that analyzes each subject in depth. His lectures connect the ancient wisdom of the Torah to the questions of our time and to contemporary reality.\n\nOver the years Rabbi Kalazan has delivered hundreds of lectures across a wide range of fields: Torah from Heaven and the human soul, Kabbalah and Jewish mysticism, the weekly Torah portion and the Bible, the reasons behind the commandments and the festivals, the End of Days and the process of redemption, as well as marriage, education and personal development. His lectures are available in video and audio on a variety of platforms. In 5784 (2024) he held a tour of strengthening lectures throughout Israel, including in Ramat Gan, Ashdod, Herzliya, Modiin, Rosh HaAyin, Haifa and Jerusalem.",
};

const vision = {
  he: "שאיפתו של הרב קלזאן היא לחזק את התודעה היהודית, לעצור את ההתבוללות התרבותית והמעשית, ולהשיב ליהודים את האמון והגאווה במורשתם — מתוך חשיפת העומק, החכמה והיופי שביהדות. המוטו המלווה את עשייתו: „האזינו, החכימו, והפיצו”.",
  en: "Rabbi Kalazan’s aspiration is to strengthen Jewish consciousness, to halt cultural and practical assimilation, and to restore to the Jewish people their trust and pride in their heritage — by revealing the depth, wisdom and beauty of Judaism. The motto that accompanies his work: “Listen, learn, and spread the word”.",
};

const bioTitle = { he: "על הרב ינון קלזאן", en: "About Rabbi Yinon Kalazan" };
const visionTitle = { he: "החזון", en: "The Vision" };

async function upsert(key, title, body) {
  await sql`
    insert into site_content (key, title, body, updated_at)
    values (${key}, ${sql.json(title)}, ${sql.json(body)}, now())
    on conflict (key) do update
      set title = ${sql.json(title)}, body = ${sql.json(body)}, updated_at = now()
  `;
  console.log(`✓ upserted ${key}`);
}

await upsert("about-bio", bioTitle, bio);
await upsert("about-vision", visionTitle, vision);

const check = await sql`select key, body->>'he' as he from site_content where key in ('about-bio','about-vision') order by key`;
for (const r of check) console.log(`  ${r.key}: ${r.he.slice(0, 50)}…`);

await sql.end();
