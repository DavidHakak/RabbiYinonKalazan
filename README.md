# Rabbi Yinon Kalazan — אתר הרב ינון קלזאן

אתר תוכן דו-לשוני (עברית / אנגלית, RTL) לרב ינון קלזאן — הרצאות, דבר תורה, אירועים,
אודות, תמיכה ויצירת קשר. בנוי ב-Next.js 16, Tailwind v4, shadcn/ui, Drizzle + Supabase.

> 📄 קראו את [`AGENTS.md`](./AGENTS.md) לאפיון המלא ולהחלטות הארכיטקטוניות.

## הרצה מקומית

```bash
npm install
cp .env.example .env.local   # אופציונלי — בלי DB האתר רץ על תוכן דמו
npm run dev                  # http://localhost:3000/he
```

בלי `DATABASE_URL` האתר עובד מיד עם תוכן לדוגמה. כדי לחבר נתונים אמיתיים:

```bash
# מלאו את .env.local עם פרטי Supabase (ראו .env.example)
npm run db:push     # יוצר את הטבלאות ב-Supabase
npm run db:seed     # טוען תוכן לדוגמה
npm run db:studio   # ממשק ויזואלי לנתונים (Drizzle Studio)
```

## סקריפטים

| פקודה | תיאור |
|-------|-------|
| `npm run dev` | שרת פיתוח |
| `npm run build` | בנייה לפרודקשן |
| `npm run start` | הרצת בילд |
| `npm run lint` | ESLint |
| `npm run db:push` / `db:seed` / `db:studio` | ניהול מסד הנתונים |

## דיפלוי (Vercel)

1. חברו את ה-repo ל-Vercel.
2. הגדירו משתני סביבה (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
3. Deploy. (`npm run build` עובר ירוק.)

## מבנה עיקרי

- `src/app/[locale]/(site)` — עמודי האתר הציבורי.
- `src/config/` — מקורות אמת (ניווט, פרטי אתר).
- `src/db/` — סכמת Drizzle, קליינט, תוכן לדוגמה.
- `src/repositories/` — שכבת גישה לנתונים (DB או fallback לדמו).
- `messages/` — קובצי תרגום (`he`, `en`).
- `src/app/globals.css` — טוקני העיצוב (צבעים/פונטים).
