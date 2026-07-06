<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Responsiveness

All development must be fully responsive — every screen and component must adapt cleanly across all viewport widths, from small mobile screens to large desktops, edge to edge with no horizontal overflow or broken layouts.

---

# אפיון ומדריך הפרויקט · Rabbi Yinon Kalazan

מסמך זה הוא **מקור האמת** לאפיון, לצורך ולהחלטות הארכיטקטוניות. כל מי (אדם או סוכן)
שנכנס לעבוד על הקוד — יקרא אותו קודם, כדי לא לחזור על האפיון הבסיסי.

## 1. מטרת הפרויקט (The "why")

אתר תדמית ותוכן עבור **הרב ינון קלזאן** — מרצה לפילוסופיה יהודית ומחשבת ישראל.
מציג: הרצאות (וידאו/אודיו/מאמר), דבר תורה שבועי, אירועים, אודות, תמיכה/תרומות, יצירת קשר.

עקרונות-על שהוגדרו על ידי בעל האתר:
- **מודרני, יפה, מעוצב ומושך** — עיצוב מבוסס מוקאפים (`docs/design-reference/`).
- **גנרי ככל האפשר** — בלי קוד ספגטי/כפילות. ניהול נכון של הוקים, קומפוננטות וסטייטים.
- **דו-לשוני (עברית + אנגלית) עם תשתית להוספת שפות** ללא שכתוב קוד.
- דיפלוי ב-**Vercel**.

## 2. הסטאק

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · shadcn/ui (radix) ·
next-intl (עברית ברירת-מחדל + אנגלית, RTL/LTR) · Drizzle ORM + Supabase Postgres ·
Supabase Auth (אדמין) · react-hook-form + zod · lucide-react.

## 3. החלטות ארכיטקטוניות (חשוב!)

1. **תוכן רב-לשוני כ-JSONB** — כל שדה מוצג נשמר `{ he, en }` (`LocalizedText`).
   הוספת שפה **אינה** דורשת מיגרציה. ראו `src/lib/localized.ts`, `src/db/schema.ts`.
2. **מקור אמת יחיד לניווט** — `src/config/navigation.ts` מזין Header + Footer + כרטיסי הבית.
3. **עובדות מול תרגומים** — ערכים זהים בכל שפה (טלפון, קישורים, תרומות) ב-`src/config/site.ts`;
   טקסט לתרגום ב-`messages/{he,en}.json`.
4. **Repositories עם fallback** — בלי `DATABASE_URL` מחזירים דמו (`src/db/seed-data.ts`),
   כך שהאתר עובד מיד; עם Supabase — עוברים אוטומטית לנתונים אמיתיים. ראו `src/repositories/`.
5. **קומפוננטות גנריות** — `ContentCard` יחיד לכל ליסטינג; פילטרים גנריים
   (`useFilteredContent` + `FilterBar` + `Pagination`) לכל סוגי התוכן.
6. **הפרדת אזורים** — `app/[locale]/(site)` ציבורי · `app/[locale]/(admin)` ניהול.

## 4. מבנה התיקיות

```
src/
├─ app/[locale]/
│   ├─ layout.tsx           # root: <html dir/lang>, פונטים, NextIntlProvider, Toaster
│   ├─ not-found.tsx        # 404 מתורגם
│   ├─ (site)/              # ציבורי (Header+Footer): page, about, lectures, dvar-torah,
│   │                       #   events, support, contact (+ [slug] לפרטים)
│   └─ (admin)/             # ניהול (בבנייה)
├─ components/  ui/ layout/ brand/ common/ lectures/ contact/ support/
├─ config/      site.ts, navigation.ts        # מקורות אמת
├─ db/          schema.ts, client.ts, seed-data.ts, seed.ts
├─ repositories/ lectures, divrei-torah, events, site-content, contact
├─ hooks/       use-filtered-content.ts
├─ i18n/        config, routing, navigation, request
├─ lib/         utils, localized, format, media, validation/
└─ middleware.ts
messages/       he.json, en.json
```

## 5. איך עושים דברים

- **להוסיף שפה:** `src/i18n/config.ts` (locales + localeMeta) → `messages/<code>.json` → הוסף `<code>` בשדות התוכן. אין מיגרציה.
- **פריט ניווט:** `src/config/navigation.ts`.
- **תוכן:** פאנל ניהול (עם Supabase) או `src/db/seed-data.ts` לדמו.
- **צבעים/עיצוב:** בלוק `BRAND DESIGN TOKENS` ב-`src/app/globals.css`.
- **הרצה:** `npm run dev` → `/he`. **DB:** `db:push` · `db:seed` · `db:studio`.

## 6. פלטת עיצוב

נייבי `--navy-*` (בסיס `#0f1c39`) · זהב `--gold-*` (`#c29a4e`) · קרם `--cream-*` (`#f6f0e6`).
פונטים: **Frank Ruhl Libre** (כותרות) · **Assistant** (גוף).

## 7. סטטוס

- ✅ תשתית, i18n+RTL, מערכת עיצוב, כל העמודים הציבוריים + עמודי פרטים, טופס קשר, 404, build ירוק.
- ⏳ פאנל ניהול (Supabase Auth + CRUD גנרי).
- ⏳ חיבור Supabase (`.env.local`) → `db:push` → `db:seed`.
- ⏳ תוכן אמיתי, לוגו/תמונות סופיים, ערוצי תרומה אמיתיים.
