# OneQuickSolutions Unified Platform

This repository now contains both OneQuickSolutions web surfaces:

- The main marketing website built with Next.js
- The HR and recruitment portal stored in `portal/`

## Repository structure

- `app/`, `components/`, `data/`, `lib/`: main website
- `portal/`: recruitment portal application
- `shared/company.json`: shared company, domain, and sender defaults
- `docs/unified-platform-plan.md`: rollout notes for the safe hosting merge

## Local setup

1. Install website dependencies:

```bash
npm install
```

2. Install portal dependencies:

```bash
npm install --prefix portal
```

3. Copy environment files as needed:

```bash
copy .env.example .env
copy portal\.env.example portal\.env
```

## Main website commands

```bash
npm run dev
npm run build
npm run start
```

## Portal commands

```bash
npm run portal:dev
npm run portal:check
npm run portal:test
npm run portal:build
```

## Shared configuration

Company identity values used by both apps are stored in `shared/company.json`.

Current shared values include:

- company name
- main website domain
- HR portal subdomain
- default contact email
- public phone numbers
- branding asset paths

## Safe deployment approach

The repository merge is complete, but the safest hosting rollout is staged:

1. Keep one Git repository for both codebases
2. Validate both apps from this repo
3. Migrate Vercel hosting only after host-based routing is tested

See `docs/unified-platform-plan.md` for the detailed reasoning.
