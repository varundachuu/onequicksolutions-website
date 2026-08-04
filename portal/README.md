# Recruitment Management Portal

OneQuickSolutions HR and recruitment portal built with plain HTML/CSS/JavaScript on the frontend and a MongoDB-backed Express API on the backend.

## Stack

- Frontend: plain `HTML`, `CSS`, and vanilla `JavaScript`
- Backend: `Node.js` + `Express`
- Database: `MongoDB` native driver
- Passwords: `bcryptjs`
- OTP mail: `nodemailer` with Gmail SMTP
- Deployment: GitHub -> Vercel

## Architecture

### Role-based account storage

- `company_login.credentials`
- `hr_consultancy_login.credentials`
- `candidate_login.credentials`

These are stored through `MONGODB_URI`.

### Candidate profile storage

- `candidate_details.profiles`

This is stored through `MONGODB_CANDIDATE_DETAILS_URI` and remains separate from login storage.

### Recruitment workflow storage

The recruitment workflow runs in the recruitment database defined by `RECRUITMENT_DB_NAME`.

Collections:

- `sessions`
- `counters`
- `jobs`
- `job_public_views`
- `job_status_history`
- `candidate_interests`
- `applications`
- `application_status_history`
- `anonymous_candidate_profiles`
- `anonymous_profile_shares`
- `interviews`
- `notifications`
- `consultancy_notes`
- `activity_logs`

## Business rules

- There are three roles: `company`, `consultancy`, and `candidate`.
- HR consultancy is the mandatory intermediary.
- Candidates do not see company identity in job APIs.
- Companies do not see candidate identity in the initial workflow.
- The app does not store resumes, CVs, resume links, or document uploads.
- Candidates apply using structured profile data only.

## Frontend routes

- `/` shared login and forgot-password flow
- `/candidate/` candidate dashboard
- `/candidate/apply/` candidate profile creation flow
- `/candidate/consent/` candidate consent flow
- `/candidate/register/` candidate registration
- `/company/` company dashboard
- `/consultancy/` consultancy candidate + recruitment operations dashboard
- `/consultancy/companies/` consultancy company dashboard

## API summary

### Health and auth

- `GET /api/health`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/candidate-consent`

### Candidate profile

- `GET /api/candidate/profile`
- `POST /api/candidate/profile`
- `PUT /api/candidate/profile`
- `PATCH /api/candidate/profile/status`
- `DELETE /api/candidate/profile`

### Shared notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:notificationId/read`
- `POST /api/notifications/read-all`

### Company recruitment

- `GET /api/company/dashboard`
- `GET /api/company/dashboard/stream`
- `POST /api/company/jobs`
- `GET /api/company/jobs`
- `GET /api/company/jobs/:jobReference`
- `PUT /api/company/jobs/:jobReference`
- `POST /api/company/jobs/:jobReference/submit`
- `PATCH /api/company/jobs/:jobReference/close-request`
- `GET /api/company/jobs/:jobReference/metrics`
- `GET /api/company/jobs/:jobReference/anonymous-candidates`
- `POST /api/company/applications/:applicationReference/decision`

### Candidate recruitment

- `GET /api/candidate/jobs`
- `GET /api/candidate/jobs/:jobReference`
- `POST /api/candidate/jobs/:jobReference/interest`
- `POST /api/candidate/jobs/:jobReference/apply`
- `GET /api/candidate/applications`
- `GET /api/candidate/applications/:applicationReference`
- `PATCH /api/candidate/applications/:applicationReference/withdraw`

### Consultancy recruitment

- `GET /api/consultancy/dashboard`
- `GET /api/consultancy/companies`
- `GET /api/consultancy/jobs`
- `GET /api/consultancy/jobs/:jobReference`
- `PATCH /api/consultancy/jobs/:jobReference/review`
- `PATCH /api/consultancy/jobs/:jobReference/publish`
- `PATCH /api/consultancy/jobs/:jobReference/status`
- `GET /api/consultancy/interests`
- `GET /api/consultancy/applications`
- `GET /api/consultancy/applications/:applicationReference`
- `PATCH /api/consultancy/applications/:applicationReference/status`
- `POST /api/consultancy/applications/:applicationReference/notes`
- `POST /api/consultancy/applications/:applicationReference/anonymize`
- `POST /api/consultancy/applications/:applicationReference/share`
- `POST /api/consultancy/interviews`
- `PATCH /api/consultancy/interviews/:interviewReference`

## Environment variables

Copy `.env.example` to `.env` for local development and configure the same values in Vercel.

Required:

```env
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster-host>/?retryWrites=true&w=majority&appName=<app-name>
MONGODB_CANDIDATE_DETAILS_URI=mongodb+srv://<candidate_details_username>:<candidate_details_password>@<cluster-host>/?retryWrites=true&w=majority&appName=<app-name>
RECRUITMENT_DB_NAME=recruitment_portal
CANDIDATE_DETAILS_DB_NAME=candidate_details
CANDIDATE_DETAILS_COLLECTION_NAME=profiles
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=<gmail_app_password>
SMTP_FROM=your-gmail-address@gmail.com
SMTP_FROM_NAME=Your App Name
RESET_OTP_EXPIRY_MINUTES=10
RESET_OTP_COOLDOWN_SECONDS=60
RESET_OTP_MAX_ATTEMPTS=5
```

Optional:

```env
SESSION_COOKIE_NAME=oqs_portal_session
SESSION_TTL_DAYS=14
SESSION_INACTIVITY_MINUTES=120
CORS_ORIGINS=https://hr.onequicksolutions.com
```

## Local development

```powershell
npm install
npm start
```

The start script first builds the `public/` directory and then starts the Node server.

When working from the unified repository root, use:

```powershell
npm install --prefix portal
npm run portal:dev
```

## Verification

```powershell
npm run check
npm test
npm run build
```

## Current safeguards

- Session-based auth with server-side role checks
- Duplicate interest prevention
- Duplicate application prevention
- Rate limiting on sensitive auth routes
- Secure header middleware
- Request size limits
- Role-safe serializers instead of returning raw MongoDB documents
- JSON `401` for protected APIs without auth
- JSON `404` for unknown `/api/*` routes
- Notification unread/read state APIs for all roles

## Vercel notes

- Framework preset: `Other`
- Root directory: `portal`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `public`

## Legacy files

Legacy PHP files remain in the repository only for reference from the older hosting variant. The active production runtime for this app is the Node/Express deployment.
