# Unified Platform Plan

Date: July 28, 2026

## What is now consolidated

- The marketing website remains the primary Next.js application at the repository root.
- The HR and recruitment portal has been imported into [portal](D:/project/MyProject-main/portal).
- Shared brand and domain values now live in [shared/company.json](D:/project/MyProject-main/shared/company.json).
- The website mailer and HR portal backend now read the same default company email from the shared config.

## Current app split inside one repo

- Website: Next.js App Router at the repository root
- Portal: Express + MongoDB + static frontend in `portal/`

This means the Git consolidation step is complete enough to manage both codebases together from one repository without rewriting the live portal immediately.

## Safe deployment recommendation

The safest path is:

1. One repository first
2. Preserve the current live domain behavior
3. Migrate hosting only after host-based routing is tested

## Why one Vercel project is possible but risky in one jump

The website and portal use different runtime models:

- The website is a Next.js app
- The portal is an Express server that serves many `/api/*` routes and static role-based frontend pages

To make them one Vercel project safely, the deployment needs host-aware routing:

- `www.onequicksolutions.com` or `onequicksolutions.com` should serve the Next.js marketing site
- `hr.onequicksolutions.com` should serve the portal root and portal APIs

That requires:

- host-based rewrites or middleware
- a Vercel-compatible adapter for the Express portal APIs
- careful handling so the website `/api/contact` route does not conflict with the portal `/api/*` routes

## Recommended migration phases

### Phase 1

Complete now:

- one Git repository
- shared company config
- both apps available in one codebase

### Phase 2

Prepare unified deployment inside this repo:

- add a host-based routing layer
- adapt the portal backend so it can run inside the Next.js/Vercel deployment model
- copy or route portal static pages through a stable internal path

### Phase 3

Cut over in Vercel only after staging verification:

- attach main domain to the marketing surface
- attach `hr.onequicksolutions.com` to the portal surface
- verify auth, cookies, API routing, MongoDB, SMTP, and static role dashboards

## Practical answer

Yes, the projects can be merged safely, but the safe version is staged:

- one repo now
- one Vercel project only after a controlled routing and API migration

Trying to force the live Express portal directly into the current Next.js deployment in one shot would be a higher-risk production change.
