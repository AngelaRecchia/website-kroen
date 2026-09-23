This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Variabili ambiente

Copia le chiavi in `.env.local` (vedi commenti nel repo). Minimo per il sito:

- `NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN`
- Per gli script CMS: `STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN`, `STORYBLOK_SPACE_ID`
- Form tessera (server): `GOOGLE_FORM_TESSERA_ACTION_URL` e `GOOGLE_FORM_TESSERA_ENTRY_*`

Opzionale: `STORYBLOK_VERSION` (`draft` | `published`). In produzione il default è `published`.

### Storyblok (ordine consigliato)

1. `npm run storyblok:components` — schemi (`page`, `settings`, `header`, `footer`, …)
2. `npm run storyblok:layout` — crea la story **`layout-components`** (content type **Layout sito** / `settings`)
3. `npm run storyblok:pages` — pagine senza header/footer nel body

Header e footer si editano **solo** nella story **Layout components** (`layout-components`): l’app li inietta nel layout con `getGlobalLayout()`. Anteprima editor: imposta in Storyblok **Location (preview)** → `https://…/layout-components` (route con `KroenShell` + WebGL, senza doppio header).

Lo script layout è idempotente; per riscrivere da zero: `STORYBLOK_LAYOUT_FORCE=1 npm run storyblok:layout`.

(Gli script leggono `.env.local` o, in fallback, `.env`.)

## Getting Started

Avvia il dev server (HTTPS, porta **3001**):

```bash
npm run dev
```

In Cursor/VS Code: **Terminal → Run Task… → dev** (task in `.vscode/tasks.json`).

Apri [https://localhost:3001](https://localhost:3001) (accetta il certificato locale se richiesto).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
