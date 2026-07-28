# Current Architecture

Date audited: July 28, 2026

## Active repository structure

- Root app: Next.js 16 marketing website
- Nested app: `portal/` recruitment and HR portal built with Express plus static HTML/CSS/JavaScript
- Shared config: `shared/company.json`

## Main website stack

- Framework: Next.js App Router
- Language: TypeScript
- Hosting target: Vercel `nextjs` project
- Contact flow: server-side SMTP with `nodemailer`
- SEO: page-level metadata generated from the server-rendered site

## Portal stack

- Backend: Node.js + Express
- Frontend: static HTML, CSS, and vanilla JavaScript
- Database: MongoDB
- Mail: `nodemailer` with SMTP
- Hosting target today: Vercel project dedicated to the portal runtime

## Shared values already consolidated

- company name
- main website domain
- HR subdomain
- default contact mailbox
- public phone numbers
- brand asset references

## Current safe architecture decision

The codebase is now unified in one repository, but hosting should remain staged until host-based routing is tested.

That means:

1. One Git repository is ready now
2. Both apps can be built from the same repo now
3. One Vercel project for both surfaces should only happen after a separate routing migration

## Why the hosting migration is still a separate step

- The main website is a Next.js application
- The portal is an Express application with its own `/api/*` surface and static role-based pages
- A direct one-step hosting merge increases the risk of route, cookie, and build conflicts

## Recommended rollout

1. Keep the unified repo as the source of truth
2. Continue validating both apps from the unified repo
3. Migrate Vercel hosting only after subdomain routing, APIs, cookies, and environment variables are tested in preview
