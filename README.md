# AEGIS Portal

Supplier governance dashboard for the AEGIS platform. Built with [Next.js](https://nextjs.org) (App Router) and deployed on Vercel.

## Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React hooks + `useReducer` (Sandbox)
- **API Layer:** BFF module at `src/lib/bff.ts` — single backend interface consumed by all screens

## Routes

| Route | Screen |
|-------|--------|
| `/` | Dashboard Overview |
| `/overview` | Overview |
| `/suppliers` | Supplier Intelligence |
| `/portfolio` | Portfolio |
| `/governance` | Governance |
| `/sandbox` | Sandbox |
| `/audit-report` | Audit Report |
| `/integration` | Integration |
| `/pilot` | Pilot |
| `/architecture` | Architecture |
| `/rules` | Rules |
| `/trust` | Trust |
| `/onboarding` | Onboarding |
| `/login` | Login |

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local` with the required environment variables:

```
NEXT_PUBLIC_AEGIS_SANDBOX_KEY=...
```

See `SECURITY_VERIFICATION.md` for details on sandbox key usage and abuse controls.

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run validate-experiments` | Validate experiment configs |

## Architecture

All data flows through the BFF layer (`src/lib/bff.ts`). Screens are client components that call BFF functions and receive typed responses. No direct backend calls from the browser. The Sandbox is the exception — it sends validation payloads directly to the Render backend for the "Form First" UX.

See `SECURITY_VERIFICATION.md` for sandbox abuse protection controls.
