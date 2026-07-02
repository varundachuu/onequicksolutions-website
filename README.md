# OneQuickSolutions Website

Marketing website for OneQuickSolutions, built with React.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your EmailJS values.

3. Start the app:

```bash
npm start
```

## Environment variables

Create a `.env` file with:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

The contact form will stay visible, but it will not submit until these values are configured.

## Production build

```bash
npm run build
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
