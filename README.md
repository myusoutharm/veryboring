# Very Boring Technologies - Web Properties

This repository contains the web properties for Very Boring Technologies, architected as a multi-domain project hosted on Cloudflare Pages.

## Project Structure

The project uses a sub-directory architecture to host multiple brands/services under a single Cloudflare Page deployment:

- **`/it-services`**: The primary content for `southarm.ca`.
- **`/ai-and-automation`**: The primary content for `veryboring.ai`.
- **`_worker.js`**: An advanced Cloudflare Page that handles domain-based routing.
- **`/contact-api`**: A separate Cloudflare Page for server-side form handling.

## Domain Routing

Routing is handled automatically by the `_worker.js` file based on the incoming `Host` header:

| Domain | Default Path |
| :--- | :--- |
| **southarm.ca** | Serves content from `/it-services` |
| **veryboring.ai** | Serves content from `/ai-and-automation` |

The `_worker.js` script ensures that:
1. Visitors to the root of a domain are served the correct landing page.
2. Assets (CSS/JS) and data (JSON) are correctly prefixed when requested.
3. Cross-domain navigation remains possible while maintaining site isolation.

## Deployment

The site is deployed to **Cloudflare Pages**. 

### Deploy Command

To deploy from your local machine using the current branch:

```bash
npx wrangler pages deploy . --project-name veryboring-site --branch newsite
```

### Build Settings (Cloudflare Dashboard)

If deploying via the Cloudflare Dashboard Git integration:
- **Build Command**: `exit 0` (No build step required for static files)
- **Build Output Directory**: `.`
- **Root Directory**: `/`

## Maintenance

- **Adding Content**: Place new static files in either the `/it-services` or `/ai-and-automation` folders.
- **Modifying Routing**: Update the `_worker.js` file if you add new domains or change the default landing folders.
