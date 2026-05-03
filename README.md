# Very Boring Technologies - Web Properties

This repository contains the web properties for Very Boring Technologies, architected as a multi-domain project hosted on Cloudflare Pages.

## Project Structure

```
/
├── _worker.js              # Cloudflare Pages edge worker: routing, SSR enrichment, form API
├── it-services/            # southarm.ca — Managed IT Services site
│   ├── index.html          # Skeleton HTML
│   ├── scripts.js          # Dynamic content renderer
│   ├── styles.css          # Styles
│   └── content/            # JSON content files (editable without touching HTML/JS)
│       ├── navigation.json
│       ├── hero.json
│       ├── services.json
│       └── ...
├── ai-and-automation/      # veryboring.ai — AI & Automation site
│   ├── index.html
│   ├── scripts.js
│   ├── styles.css
│   └── content/
│       └── ...
└── contact-api/            # (Legacy) Standalone Cloudflare Worker for form handling
    ├── index.js
    └── wrangler.toml
```

## Content Architecture (JS-Driven with Edge SSR)

This project follows a **"Content-as-Data"** approach combined with **Edge-Side Rendering** for SEO.

### How It Works

```
Browser Request
      │
      ▼
_worker.js (Cloudflare Edge)
      │
      ├─ Fetches skeleton HTML + all JSON content files in parallel
      ├─ Injects SEO <meta> tags into <head>
      ├─ Injects window.__CONTENT__ = { ...all JSON data } into <head>
      │
      ▼
Browser receives fully enriched HTML
      │
      ├─ Search crawlers: read meta tags + can index any server-rendered text
      └─ scripts.js: reads window.__CONTENT__ (no fetch needed) → renders DOM
```

### The Three Layers

| Layer | File | Purpose |
| :--- | :--- | :--- |
| **Structure** | `index.html` | Lightweight skeleton with empty `<section id="...">` containers |
| **Content** | `content/*.json` | All marketing copy, pricing, nav links — edit here to update the site |
| **Rendering** | `scripts.js` | Reads content and builds DOM; uses `window.__CONTENT__` if available, falls back to `fetch()` for local dev |

### SEO Meta Tags

SEO titles and descriptions are defined in the `SEO_META` object at the top of `_worker.js`. Edit this object to update page titles and meta descriptions without deploying content changes.

```javascript
// _worker.js
const SEO_META = {
  'it-services': {
    'index.html': {
      title: 'Managed IT Services | Very Boring Technologies',
      description: '...',
    },
    // Add more pages here
  },
  'ai-and-automation': { ... }
};
```

### Benefits

- **SEO-Friendly**: Crawlers receive fully-tagged HTML including `<meta description>`, Open Graph, and Twitter Card tags — injected at the edge before the response is sent.
- **Fast**: `scripts.js` skips all JSON `fetch()` calls in production; data is already inline in `window.__CONTENT__`.
- **Maintainable**: Update marketing copy in `/content/*.json`. No HTML or JS changes needed.
- **Local Dev Works**: When running locally (no edge worker), `scripts.js` falls back to fetching JSON files directly.

## Form & Backend Logic

Form submissions are handled by the **`/api/contact` endpoint in `_worker.js`** (not the `/contact-api` folder, which is legacy). This endpoint:

1. Validates the request content type and payload.
2. Verifies the **reCAPTCHA v3** token with Google (including score and action checks).
3. Forwards sanitized field data to **HubSpot** via the Forms Submissions API.

Sensitive credentials (`HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID`, `RECAPTCHA_SECRET_KEY`) are stored as **Cloudflare environment secrets** and never exposed to the browser.

## Domain Routing

Routing is handled automatically by `_worker.js` based on the incoming `Host` header:

| Domain | Serves From |
| :--- | :--- |
| `southarm.ca` | `/it-services/` |
| `veryboring.ai` | `/ai-and-automation/` |
| `*.pages.dev` (preview) | Path-based (e.g. `/it-services/index.html`) |

## Deployment

The site is deployed to **Cloudflare Pages** via GitHub integration. Every push to the configured branch triggers an automatic deployment — no build step is required.

### Manual Deploy Command

```bash
npx wrangler pages deploy . --project-name veryboring-site --branch newsite
```

### Cloudflare Dashboard Build Settings

| Setting | Value |
| :--- | :--- |
| **Build Command** | `exit 0` (no build step) |
| **Build Output Directory** | `.` |
| **Root Directory** | `/` |

### Required Environment Secrets (Cloudflare Dashboard)

| Variable | Description |
| :--- | :--- |
| `HUBSPOT_PORTAL_ID` | HubSpot portal ID |
| `HUBSPOT_FORM_ID` | HubSpot form ID |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 **secret** key (server-side) |
| `RECAPTCHA_MIN_SCORE` | *(Optional)* Minimum score threshold, default `0.5` |
| `RECAPTCHA_REQUIRED_ACTION` | *(Optional)* Expected action name, default `contact_submit` |

> [!NOTE]
> The reCAPTCHA **site key** (public) is embedded directly in `scripts.js` and is safe to commit to the repository.

## Maintenance

| Task | What to Edit |
| :--- | :--- |
| Update marketing copy or pricing | `/it-services/content/*.json` or `/ai-and-automation/content/*.json` |
| Update page SEO titles/descriptions | `SEO_META` object in `_worker.js` |
| Add a new domain | `southarmHosts` / `veryboringHosts` sets in `_worker.js` |
| Add a new sub-page | Create the `.html` file and add its content keys to `getContentKeys()` in `_worker.js` |
| Change form fields | Update the `fields` array in the relevant `contact.json` |
