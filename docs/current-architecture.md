# Current Architecture Before Migration

Date audited: July 28, 2026

## Existing stack

- Framework: React 18
- Build tool: Vite 7
- Routing: React Router DOM 6 with a client-rendered SPA
- Hosting: Vercel configured for static `dist` output plus SPA rewrites to `index.html`
- Styling: hand-written global CSS files under `src/components/css-files` and `src/App.css`
- SEO: a client-side `SeoManager` mutates titles, meta tags, schema, and canonicals after route changes
- Contact form: client-side EmailJS submission via `@emailjs/browser`
- Content model: shared structured content in `src/content/siteContent.js`

## Existing public routes

- `/`
- `/services`
- `/products`
- `/programs`
- `/about`
- `/contact`
- `/hr-consultancy`

## Current architecture issues

- Important marketing copy depends on client-side JavaScript because routes render through the SPA shell.
- Metadata and schema are injected in the browser instead of coming from the initial HTML response.
- Service discovery relies on the main services page and hash-based navigation instead of dedicated URLs.
- The Vercel rewrite sends unknown routes to the homepage shell, which is not ideal for SEO or HTTP status handling.
- Contact-form source context and service-specific enquiry tracking are limited.

## Migration direction

- Move the public website to Next.js App Router with TypeScript.
- Keep the existing brand system, imagery, and overall visual language.
- Render marketing pages statically on the server by default.
- Preserve interactive pieces such as theme switching, the mascot assistant, mobile navigation, FAQs, and contact forms as client components only where required.
