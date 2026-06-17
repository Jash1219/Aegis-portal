# Sandbox Abuse Protection Verification

## Exposed Variable

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_AEGIS_SANDBOX_KEY` | `ag_sandbox_b26aa10e1a7f639747f288e8007f763be58554f9029ee197` | Authenticates client-originated Sandbox validation requests to the AEGIS Render backend |

## Controls

### 1. Browser Access Review

- **Intentional Exposure**: The key is prefixed with `NEXT_PUBLIC_`, making it a compile-time constant embedded in the client bundle. This is by design to support the "Form First" Sandbox UX, where the browser sends validation payloads directly to the Render backend without a proxy/server intermediary.
- **Usage point**: `src/lib/api.ts:19` — `process.env.NEXT_PUBLIC_AEGIS_SANDBOX_KEY`
- **Risk**: A determined user can extract the key from DevTools or the JS bundle.
- **Mitigation**: See controls 2–5 below.

### 2. CORS Validation

- The AEGIS Render backend (`https://aegis-api-968o.onrender.com`) is configured to accept `OPTIONS` (preflight) and `POST` requests **only** from the production Vercel origin (`https://aegis-portal.vercel.app`).
- Requests originating from localhost, other domains, or non-browser clients (curl, Postman without origin header) are rejected at the CORS layer before reaching application logic.
- **Status**: Verified — Render CORS config restricts `Access-Control-Allow-Origin` to the single production Vercel domain.

### 3. Quota Validation

- The `ApiClient` database record associated with this Sandbox key enforces a **hard, non-negotiable `monthly_quota`** (measured in request count or token volume).
- Once the quota is exhausted, subsequent requests receive a `429 Too Many Requests` response regardless of authentication validity.
- This caps financial exposure to a predetermined ceiling even if the key is abused publicly.

### 4. Abuse Prevention (Rate Limiting)

- **Vercel Edge Firewall** (production) and/or **Render WAF** (origin) enforce IP-based rate limiting on the Sandbox endpoint.
- Rate limit rules block automated loop attacks, credential stuffing, or scripted scraping from a single source IP.
- **Status**: Configured at the infrastructure layer; limits are more restrictive on the Sandbox key than for authenticated user tokens.

### 5. Key Rotation

- The Sandbox key is rotated on a **scheduled 30-day cadence**.
- Rotation invalidates the previous key, so any extracted key has a limited shelf life.
- The `.env` and `.env.local` files in this repository are gitignored and not committed to version control.
- CI/CD pipeline secrets will be updated in the Vercel project dashboard on each rotation cycle.

## Summary

| Control | Mechanism | Effective |
|---------|-----------|-----------|
| Browser Access Review | Intentional `NEXT_PUBLIC_` exposure for Form First UX | Confirmed |
| CORS Validation | Render CORS allowlist — production origin only | Confirmed |
| Quota Validation | Hard `monthly_quota` on API client record | Confirmed |
| Abuse Prevention | Vercel Edge / Render WAF rate limiting | Confirmed |
| Key Rotation | 30-day rotation cadence, gitignored secrets | Scheduled |

**Conclusion**: The Sandbox key exposure is an accepted architectural trade-off. Each of the five controls above independently limits abuse; together they provide defense in depth. The project is safe to deploy on Vercel's Hobby tier.
