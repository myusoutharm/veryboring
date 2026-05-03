# Very Boring Technologies - Web Properties

This repository contains the web properties for Very Boring Technologies, architected as a multi-domain project hosted on Cloudflare Pages.

## Project Structure

```
/
├── _worker.js              # Cloudflare Pages edge worker: routing, SSR enrichment, form API
├── worker/                 # Worker modules (SEO, sitemap, site renderers)
│   ├── seo.js
│   ├── escape.js
│   ├── content-map.js
│   └── renderers/
│       ├── index.js
│       ├── it-services.js
│       └── ai-and-automation.js
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
```

## Content Architecture (JS-Driven with Edge Prerendering)

This project follows a **"Content-as-Data"** approach combined with **Edge-Side HTML prerendering** for SEO.

### How It Works

```
Browser Request
      │
      ▼
_worker.js (Cloudflare Edge)
      │
      ├─ Fetches skeleton HTML + all JSON content files in parallel
      ├─ Renders crawlable HTML into each content section (`#hero`, `#services`, etc.)
      ├─ Injects SEO <meta> tags into <head>
      ├─ Injects canonical URL + robots directives
      ├─ Injects window.__CONTENT__ = { ...all JSON data } into <head>
      │
      ▼
Browser receives fully enriched HTML
      │
      ├─ Search crawlers: receive real page copy in initial HTML (no JS execution required)
      └─ scripts.js: reads window.__CONTENT__ (no fetch needed) → renders DOM
```

### The Three Layers

| Layer | File | Purpose |
| :--- | :--- | :--- |
| **Structure** | `index.html` | Lightweight skeleton containers (`<section id="...">`) |
| **Content** | `content/*.json` | All marketing copy, pricing, nav links — edit here to update the site |
| **Edge Rendering** | `_worker.js` | Fetches JSON and injects prerendered HTML + SEO meta/canonical tags |
| **Client Hydration** | `scripts.js` | Rebuilds interactive UI from `window.__CONTENT__` (or `fetch()` fallback for local dev) |

### SEO Meta Tags

SEO titles and descriptions are defined in the `SEO_META` object in `worker/seo.js`. Edit this object to update page titles and meta descriptions without deploying content changes.

```javascript
// worker/seo.js
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

- **SEO-Friendly**: Crawlers receive semantic body content in the initial response, plus `<meta description>`, Open Graph, Twitter Card, canonical, and robots tags.
- **Fast**: `scripts.js` skips all JSON `fetch()` calls in production; data is already inline in `window.__CONTENT__`.
- **Maintainable**: Update marketing copy in `/content/*.json`. No HTML or JS changes needed.
- **Local Dev Works**: When running locally (no edge worker), `scripts.js` falls back to fetching JSON files directly.

### SEO Discovery Files

`_worker.js` also serves:
- `GET /robots.txt` (host-aware sitemap reference)
- `GET /sitemap.xml` (domain-specific URL list for `southarm.ca` and `veryboring.ai`)

## Form & Backend Logic

Form submissions are handled by the **`/api/contact` endpoint in `_worker.js`**. This endpoint:

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
| Update page SEO titles/descriptions | `SEO_META` object in `worker/seo.js` |
| Add a new domain | `southarmHosts` / `veryboringHosts` sets in `_worker.js` |
| Add a new sub-page | Create the `.html` file, add content keys in `worker/content-map.js`, and add renderer output in `worker/renderers/*.js` |
| Change form fields | Update the `fields` array in the relevant `contact.json` |

## Code Quality Check

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=myusoutharm_veryboring&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=myusoutharm_veryboring)