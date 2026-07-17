# OneQuickSolutions Website

Marketing website for OneQuickSolutions, built with React and Vite.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your EmailJS values.

3. Start the app:

```bash
npm run dev
```

## Environment variables

Create a `.env` file with:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Legacy `REACT_APP_*` variable names are still supported during the migration, but `VITE_*` is the long-term format.

## Production build

```bash
npm run build
```

## Preview the production build locally

```bash
npm run preview
```

## GitHub replacement workflow

If you are replacing the contents of an old GitHub repository with this project, the usual flow is:

```bash
git init
git branch -M main
git add .
git commit -m "Replace project with new OneQuickSolutions site"
git remote add origin <your-github-repo-url>
git push -f origin main
```

Use `git remote set-url origin <your-github-repo-url>` instead of `git remote add origin ...` if the remote already exists.
