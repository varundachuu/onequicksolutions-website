require("dotenv").config({ quiet: true });

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cors = require("cors");
const express = require("express");
const { existsSync } = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const sharedCompany = require("../shared/company.json");

const app = express();
const port = Number(process.env.PORT) || 8000;
const mongoUri = String(process.env.MONGODB_URI || "").trim();
const candidateDetailsMongoUri = String(process.env.MONGODB_CANDIDATE_DETAILS_URI || "").trim();
const defaultMongoTimeoutMs = 15000;
const mongoServerSelectionTimeoutMs = Math.max(
  5000,
  Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || defaultMongoTimeoutMs,
);
const mongoConnectTimeoutMs = Math.max(
  5000,
  Number(process.env.MONGODB_CONNECT_TIMEOUT_MS) || defaultMongoTimeoutMs,
);
const mongoConnectionPingCacheMs = 30000;
const candidateDetailsUriSource = candidateDetailsMongoUri
  ? "MONGODB_CANDIDATE_DETAILS_URI"
  : "missing";
const candidateDetailsUsesPrimaryConnection = Boolean(
  candidateDetailsMongoUri && mongoUri && candidateDetailsMongoUri === mongoUri,
);
const candidateDetailsStorage = {
  databaseName: String(process.env.CANDIDATE_DETAILS_DB_NAME || "candidate_details").trim(),
  collectionName: String(process.env.CANDIDATE_DETAILS_COLLECTION_NAME || "profiles").trim(),
  uriSource: candidateDetailsUriSource,
  usesPrimaryConnection: candidateDetailsUsesPrimaryConnection,
};
const publicDir = path.join(__dirname, "public");
const saltRounds = 12;
const databaseRetryDelayMs = 10000;
const defaultOtpSenderEmail = String(sharedCompany.email || "onequicksolutionsinfo@gmail.com").trim();
const smtpHost = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpSecure =
  String(process.env.SMTP_SECURE || "").trim().toLowerCase() === "true" ||
  smtpPort === 465;
const smtpUser = String(process.env.SMTP_USER || defaultOtpSenderEmail).trim();
const smtpPass = String(process.env.SMTP_PASS || "").trim();
const smtpFrom = String(process.env.SMTP_FROM || smtpUser || defaultOtpSenderEmail).trim();
const resetOtpExpiryMinutes = Number(process.env.RESET_OTP_EXPIRY_MINUTES) || 10;
const resetOtpCooldownSeconds = Number(process.env.RESET_OTP_COOLDOWN_SECONDS) || 60;
const resetOtpMaxAttempts = Number(process.env.RESET_OTP_MAX_ATTEMPTS) || 5;
const resetOtpExpiryMs = resetOtpExpiryMinutes * 60 * 1000;
const resetOtpCooldownMs = resetOtpCooldownSeconds * 1000;
const candidateConsentVersion = "candidate-data-storage-v1";
const candidateConsentSource = "candidate-portal";
const roleLabels = {
  company: "Company",
  consultancy: "HR Consultancy",
  candidate: "Candidate",
};
const roleStorage = {
  company: {
    databaseName: "company_login",
    collectionName: "credentials",
  },
  consultancy: {
    databaseName: "hr_consultancy_login",
    collectionName: "credentials",
  },
  candidate: {
    databaseName: "candidate_login",
    collectionName: "credentials",
  },
};
const recruitmentDbName = String(process.env.RECRUITMENT_DB_NAME || "recruitment_portal").trim();
const sessionCookieName = String(process.env.SESSION_COOKIE_NAME || "oqs_portal_session").trim();
const sessionTtlDays = Math.max(1, Number(process.env.SESSION_TTL_DAYS) || 14);
const sessionTtlMs = sessionTtlDays * 24 * 60 * 60 * 1000;
const sessionInactivityMinutes = Math.max(
  1,
  Number(process.env.SESSION_INACTIVITY_MINUTES) || 120,
);
const sessionInactivityMs = sessionInactivityMinutes * 60 * 1000;
const secureCookies = String(process.env.NODE_ENV || "").trim().toLowerCase() === "production";
const allowedOrigins = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const recruitmentCollections = {
  sessions: "sessions",
  counters: "counters",
  jobs: "jobs",
  jobPublicViews: "job_public_views",
  jobStatusHistory: "job_status_history",
  candidateInterests: "candidate_interests",
  applications: "applications",
  applicationStatusHistory: "application_status_history",
  anonymousCandidateProfiles: "anonymous_candidate_profiles",
  anonymousProfileShares: "anonymous_profile_shares",
  interviews: "interviews",
  notifications: "notifications",
  consultancyNotes: "consultancy_notes",
  activityLogs: "activity_logs",
};
const jobStatusValues = [
  "draft",
  "submitted",
  "under_consultancy_review",
  "changes_requested",
  "approved",
  "published",
  "paused",
  "closed",
  "rejected",
  "archived",
];
const companyEditableJobStatuses = new Set(["draft", "changes_requested"]);
const companySubmittableJobStatuses = new Set(["draft", "changes_requested"]);
const publicJobVisibleStatuses = new Set(["published"]);
const publicJobClosedStatuses = new Set(["paused", "closed", "rejected", "archived"]);
const applicationStatusValues = [
  "interest_registered",
  "application_submitted",
  "under_consultancy_review",
  "additional_information_required",
  "consultancy_screening",
  "consultancy_shortlisted",
  "consultancy_rejected",
  "anonymous_profile_shared_with_company",
  "company_review_pending",
  "company_selected_for_interview",
  "company_rejected",
  "interview_coordination",
  "interview_scheduled",
  "interview_completed",
  "offer_discussion",
  "selected",
  "not_selected",
  "joined",
  "application_withdrawn",
  "job_closed",
  "on_hold",
];
const companyDecisionActions = [
  "request_interview",
  "reject_candidate",
  "request_more_information",
  "put_on_hold",
];
const candidateFriendlyStatusLabels = {
  interest_registered: "Interest registered",
  application_submitted: "Application submitted",
  under_consultancy_review: "Under consultancy review",
  additional_information_required: "Additional information required",
  consultancy_screening: "Consultancy screening in progress",
  consultancy_shortlisted: "Shortlisted by recruitment team",
  consultancy_rejected: "Not selected by recruitment team",
  anonymous_profile_shared_with_company: "Profile shared with hiring team",
  company_review_pending: "Hiring team review pending",
  company_selected_for_interview: "Selected for interview consideration",
  company_rejected: "Not selected by hiring team",
  interview_coordination: "Interview coordination in progress",
  interview_scheduled: "Interview scheduled",
  interview_completed: "Interview completed",
  offer_discussion: "Offer discussion in progress",
  selected: "Selected",
  not_selected: "Not selected",
  joined: "Joined",
  application_withdrawn: "Application withdrawn",
  job_closed: "Job closed",
  on_hold: "Application on hold",
};
const companyVisibleStatusLabels = {
  interest_registered: "Interest registered",
  application_submitted: "Application submitted",
  under_consultancy_review: "Under consultancy review",
  additional_information_required: "Additional information requested",
  consultancy_screening: "Consultancy screening",
  consultancy_shortlisted: "Shortlisted by consultancy",
  consultancy_rejected: "Rejected by consultancy",
  anonymous_profile_shared_with_company: "Anonymous profile shared",
  company_review_pending: "Company review pending",
  company_selected_for_interview: "Interview requested",
  company_rejected: "Company rejected",
  interview_coordination: "Interview coordination",
  interview_scheduled: "Interview scheduled",
  interview_completed: "Interview completed",
  offer_discussion: "Offer discussion",
  selected: "Selected",
  not_selected: "Not selected",
  joined: "Joined",
  application_withdrawn: "Application withdrawn",
  job_closed: "Job closed",
  on_hold: "On hold",
};
const workModeValues = ["onsite", "hybrid", "remote", "field"];
const employmentTypeValues = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "trainee",
  "temporary",
];
const candidateAudienceValues = ["all", "fresher", "experienced"];
const sensitiveRateLimitState = new Map();

let mongoClient;
let databaseErrorMessage = "";
let databasePublicMessage = "Database connection is starting up.";
let databaseConnectPromise = null;
let databaseRetryTimer = null;
let databaseLastVerifiedAt = 0;
let candidateDetailsClient;
let candidateDetailsStore = null;
let candidateDetailsErrorMessage = "";
let candidateDetailsPublicMessage = "Candidate details storage is starting up.";
let candidateDetailsConnectPromise = null;
let candidateDetailsRetryTimer = null;
let candidateDetailsLastVerifiedAt = 0;
let mailTransporter = null;
let recruitmentStore = null;
const credentialStores = {};
const companyDashboardClients = new Set();

app.disable("x-powered-by");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRoleLabel(role) {
  return roleLabels[role] || role;
}

function getRoleStore(role) {
  return credentialStores[role];
}

function isMailConfigured() {
  return Boolean(smtpUser && smtpPass && smtpFrom);
}

function getMailConfigurationMessage() {
  return `Email sender is not configured. Add SMTP_PASS for ${smtpUser || defaultOtpSenderEmail} in the .env file.`;
}

function getMailTransporter() {
  if (!isMailConfigured()) {
    throw new Error(getMailConfigurationMessage());
  }

  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return mailTransporter;
}

async function verifyMailTransporterReady() {
  const transporter = getMailTransporter();

  await transporter.verify();

  return transporter;
}

function getCandidateStore() {
  return credentialStores.candidate || null;
}

function getCandidateDetailsStore() {
  return candidateDetailsStore;
}

function isDatabaseReady() {
  return Object.keys(credentialStores).length === Object.keys(roleStorage).length;
}

function isCandidateDetailsReady() {
  return Boolean(candidateDetailsStore);
}

function clearCredentialStores() {
  for (const role of Object.keys(credentialStores)) {
    delete credentialStores[role];
  }
}

function clearCandidateDetailsStore() {
  candidateDetailsStore = null;
}

function getDatabaseUnavailableMessage() {
  return databasePublicMessage || "Database connection is not ready yet.";
}

function getCandidateDetailsUnavailableMessage() {
  return candidateDetailsPublicMessage || "Candidate details storage is not ready yet.";
}

function isMongoConnectivityError(error) {
  const message = String(error?.message || "");
  const name = String(error?.name || "");
  const combined = `${name} ${message}`;

  return /Mongo.*(Network|ServerSelection|Timeout)|server selection timed out|timed out after \d+ ms|ECONNRESET|ECONNREFUSED|ETIMEDOUT|querySrv|ENOTFOUND/i.test(
    combined,
  );
}

function normalizeTextValue(value) {
  return String(value || "").trim();
}

async function closeMongoClientQuietly(client) {
  if (!client) {
    return;
  }

  await client.close().catch(() => {});
}

async function resetPrimaryDatabaseConnection() {
  const activeClient = mongoClient;

  mongoClient = null;
  databaseLastVerifiedAt = 0;
  clearCredentialStores();
  clearRecruitmentStore();

  await closeMongoClientQuietly(activeClient);
}

async function resetCandidateDetailsConnection() {
  const activeClient = candidateDetailsClient;

  candidateDetailsClient = null;
  candidateDetailsLastVerifiedAt = 0;
  clearCandidateDetailsStore();

  await closeMongoClientQuietly(activeClient);
}

async function pingMongoConnection(client) {
  if (!client) {
    throw new Error("MongoDB client is not initialized.");
  }

  await client.db("admin").command({ ping: 1 });
}

function isRecentConnectionVerification(lastVerifiedAt) {
  if (!lastVerifiedAt) {
    return false;
  }

  return Date.now() - lastVerifiedAt < mongoConnectionPingCacheMs;
}

function escapeRegexPattern(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCandidateProfileVisibility(profile = {}) {
  const isVisibleForHiring =
    profile.isVisibleForHiring !== false && profile.profileStatus !== "deactivated";

  return {
    isVisibleForHiring,
    profileStatus: isVisibleForHiring ? "active" : "deactivated",
  };
}

function buildActiveCandidateProfileFilter() {
  return {
    isVisibleForHiring: { $ne: false },
    profileStatus: { $ne: "deactivated" },
  };
}

function buildConsultancyCandidateFilter(query = {}) {
  const q = normalizeTextValue(query.q);
  const candidateType = normalizeTextValue(query.candidateType).toLowerCase();
  const preferredRole = normalizeTextValue(query.preferredRole);
  const location = normalizeTextValue(query.location);
  const filters = [buildActiveCandidateProfileFilter()];

  if (candidateType && ["fresher", "experienced"].includes(candidateType)) {
    filters.push({ candidateType });
  }

  if (preferredRole) {
    filters.push({
      preferredRole: {
        $regex: escapeRegexPattern(preferredRole),
        $options: "i",
      },
    });
  }

  if (location) {
    filters.push({
      location: {
        $regex: escapeRegexPattern(location),
        $options: "i",
      },
    });
  }

  if (q) {
    const searchRegex = {
      $regex: escapeRegexPattern(q),
      $options: "i",
    };

    filters.push({
      $or: [
        { fullName: searchRegex },
        { email: searchRegex },
        { preferredRole: searchRegex },
        { location: searchRegex },
        { skills: searchRegex },
      ],
    });
  }

  return {
    q,
    candidateType,
    preferredRole,
    location,
    mongoFilter: filters.length === 1 ? filters[0] : { $and: filters },
  };
}

function formatAccountDisplayName(name, email, fallback = "Account") {
  const normalizedName = normalizeTextValue(name);

  if (normalizedName) {
    return normalizedName;
  }

  const emailPrefix = normalizeEmail(email)
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  if (!emailPrefix) {
    return fallback;
  }

  return emailPrefix.replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildConsultancyCompanyFilter(query = {}) {
  const q = normalizeTextValue(query.q);
  const loginActivity = normalizeTextValue(query.loginActivity).toLowerCase();
  const filters = [];

  if (loginActivity === "logged-in") {
    filters.push({
      lastLoginAt: { $type: "date" },
    });
  }

  if (loginActivity === "never-logged-in") {
    filters.push({
      $or: [{ lastLoginAt: null }, { lastLoginAt: { $exists: false } }],
    });
  }

  if (q) {
    const searchRegex = {
      $regex: escapeRegexPattern(q),
      $options: "i",
    };

    filters.push({
      $or: [{ name: searchRegex }, { email: searchRegex }],
    });
  }

  return {
    q,
    loginActivity,
    mongoFilter:
      filters.length === 0 ? {} : filters.length === 1 ? filters[0] : { $and: filters },
  };
}

function sanitizeCandidateProfile(profile) {
  if (!profile) {
    return null;
  }

  const visibility = getCandidateProfileVisibility(profile);

  return {
    id: String(profile._id),
    candidateCredentialId: profile.candidateCredentialId || null,
    candidateLoginEmail: profile.candidateLoginEmail || profile.email,
    candidateLoginName: profile.candidateLoginName || profile.fullName || "",
    consent: profile.consent === true,
    profileStatus: visibility.profileStatus,
    isVisibleForHiring: visibility.isVisibleForHiring,
    deactivatedAt: profile.deactivatedAt || null,
    candidateType: profile.candidateType,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    preferredRole: profile.preferredRole,
    preferredWorkLocation: profile.preferredWorkLocation || "",
    skills: profile.skills,
    skillList: Array.isArray(profile.skillList) ? profile.skillList : [],
    summary: profile.summary,
    profileData: profile.profileData || null,
    fresherDetails: profile.fresherDetails || null,
    experiencedDetails: profile.experiencedDetails || null,
    createdAt: profile.createdAt || null,
    submittedAt: profile.submittedAt || null,
    updatedAt: profile.updatedAt || null,
  };
}

function sanitizeConsultancyCompanyCredential(credential) {
  if (!credential) {
    return null;
  }

  const hasCustomName = normalizeTextValue(credential.name).length > 0;

  return {
    id: String(credential._id),
    role: credential.role,
    name: credential.name || "",
    displayName: formatAccountDisplayName(credential.name, credential.email, "Company Account"),
    email: credential.email || "",
    createdAt: credential.createdAt || null,
    lastLoginAt: credential.lastLoginAt || null,
    updatedAt: credential.updatedAt || null,
    hasCustomName,
    loginActivity: credential.lastLoginAt ? "logged-in" : "never-logged-in",
  };
}

function buildMongoClient(uri) {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: mongoServerSelectionTimeoutMs,
    connectTimeoutMS: mongoConnectTimeoutMs,
  });
}

function clearRecruitmentStore() {
  recruitmentStore = null;
}

function isRecruitmentReady() {
  return Boolean(recruitmentStore?.collections);
}

function getRecruitmentStore() {
  return recruitmentStore;
}

function parseDelimitedList(value) {
  return String(value || "")
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function sanitizeOptionalText(value) {
  const normalizedValue = normalizeTextValue(value);
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function sanitizeOptionalNumber(value) {
  if (value === null || value === undefined || String(value).trim().length === 0) {
    return null;
  }

  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
}

function coerceDateValue(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeLookupKey(value) {
  return String(value || "").trim().toLowerCase();
}

function toObjectId(value) {
  if (!value) {
    return null;
  }

  if (value instanceof ObjectId) {
    return value;
  }

  const normalizedValue = String(value).trim();
  return ObjectId.isValid(normalizedValue) ? new ObjectId(normalizedValue) : null;
}

function createPublicReference(prefix, sequenceNumber) {
  return `${prefix}-OQS-${String(sequenceNumber).padStart(6, "0")}`;
}

function getRequestIpAddress(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();

  if (forwardedFor) {
    return forwardedFor;
  }

  return (
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    "unknown"
  );
}

function getRequestOrigin(req) {
  const forwardedHost = String(req.headers["x-forwarded-host"] || "")
    .split(",")[0]
    .trim();
  const host = forwardedHost || String(req.headers.host || "").trim();

  if (!host) {
    return "";
  }

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProto || req.protocol || "http";

  return `${protocol}://${host}`;
}

function isOriginAllowed(origin, req) {
  if (!origin) {
    return true;
  }

  if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(origin)) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  const requestOrigin = getRequestOrigin(req);
  return Boolean(requestOrigin) && origin.toLowerCase() === requestOrigin.toLowerCase();
}

function parseCookies(headerValue) {
  return String(headerValue || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();

      if (key) {
        cookies[key] = decodeURIComponent(value);
      }

      return cookies;
    }, {});
}

function appendCookie(res, cookieValue) {
  const currentHeader = res.getHeader("Set-Cookie");

  if (!currentHeader) {
    res.setHeader("Set-Cookie", [cookieValue]);
    return;
  }

  const cookieList = Array.isArray(currentHeader) ? currentHeader : [currentHeader];
  cookieList.push(cookieValue);
  res.setHeader("Set-Cookie", cookieList);
}

function setCookie(res, name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    segments.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  segments.push(`Path=${options.path || "/"}`);
  segments.push(`SameSite=${options.sameSite || "Lax"}`);

  if (options.httpOnly !== false) {
    segments.push("HttpOnly");
  }

  if (options.secure) {
    segments.push("Secure");
  }

  appendCookie(res, segments.join("; "));
}

function clearCookie(res, name) {
  setCookie(res, name, "", {
    maxAge: 0,
    path: "/",
    sameSite: "Lax",
    secure: secureCookies,
  });
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function getSessionTokenFromRequest(req) {
  return parseCookies(req.headers.cookie || "")[sessionCookieName] || "";
}

function getRateLimitKey(req, scope) {
  return `${scope}:${getRequestIpAddress(req)}`;
}

function enforceSensitiveRateLimit(req, scope, limit, windowMs) {
  const key = getRateLimitKey(req, scope);
  const now = Date.now();
  const recentTimestamps = (sensitiveRateLimitState.get(key) || []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recentTimestamps.length >= limit) {
    sensitiveRateLimitState.set(key, recentTimestamps);
    return false;
  }

  recentTimestamps.push(now);
  sensitiveRateLimitState.set(key, recentTimestamps);
  return true;
}

function getJobStatusLabel(status) {
  return String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function sanitizeHtmlUnsafeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsEmployerIdentitySignals(text, companyHints = []) {
  const normalizedText = sanitizeHtmlUnsafeText(text).toLowerCase();

  if (!normalizedText) {
    return false;
  }

  const directPatterns = [
    /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i,
    /\b(?:https?:\/\/|www\.)\S+/i,
    /\b(?:\+?\d[\d\s()-]{7,}\d)\b/i,
    /\blinkedin\.com\b/i,
  ];

  if (directPatterns.some((pattern) => pattern.test(normalizedText))) {
    return true;
  }

  return companyHints.some((hint) => {
    const normalizedHint = normalizeLookupKey(hint);
    return normalizedHint.length >= 4 && normalizedText.includes(normalizedHint);
  });
}

async function getNextSequenceValue(collection, key) {
  const result = await collection.findOneAndUpdate(
    { key },
    {
      $inc: { value: 1 },
      $setOnInsert: {
        createdAt: new Date(),
      },
      $set: {
        updatedAt: new Date(),
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  return Number(result?.value?.value || 1);
}

function buildRecruitmentStore(nextClient) {
  const database = nextClient.db(recruitmentDbName);

  return {
    databaseName: recruitmentDbName,
    database,
    collections: Object.fromEntries(
      Object.entries(recruitmentCollections).map(([key, collectionName]) => [
        key,
        database.collection(collectionName),
      ]),
    ),
  };
}

async function initializeRecruitmentIndexes(store) {
  const { collections } = store;

  await Promise.all([
    collections.sessions.createIndex(
      { sessionHash: 1 },
      { unique: true, name: "uniq_session_hash" },
    ),
    collections.sessions.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "ttl_session_expiry" },
    ),
    collections.counters.createIndex({ key: 1 }, { unique: true, name: "uniq_counter_key" }),
    collections.jobs.createIndex({ jobReference: 1 }, { unique: true, name: "uniq_job_reference" }),
    collections.jobs.createIndex(
      { companyAccountId: 1, createdAt: -1 },
      { name: "idx_jobs_company_created" },
    ),
    collections.jobPublicViews.createIndex(
      { jobReference: 1 },
      { unique: true, name: "uniq_public_job_reference" },
    ),
    collections.jobPublicViews.createIndex(
      { currentStatus: 1, applicationDeadline: 1, updatedAt: -1 },
      { name: "idx_public_jobs_status_deadline" },
    ),
    collections.candidateInterests.createIndex(
      { interestReference: 1 },
      { unique: true, name: "uniq_interest_reference" },
    ),
    collections.candidateInterests.createIndex(
      { jobId: 1, candidateProfileId: 1 },
      { unique: true, name: "uniq_interest_candidate_job" },
    ),
    collections.applications.createIndex(
      { applicationReference: 1 },
      { unique: true, name: "uniq_application_reference" },
    ),
    collections.applications.createIndex(
      { jobId: 1, candidateProfileId: 1 },
      { unique: true, name: "uniq_application_candidate_job" },
    ),
    collections.applications.createIndex(
      { companyAccountId: 1, updatedAt: -1 },
      { name: "idx_applications_company_updated" },
    ),
    collections.applicationStatusHistory.createIndex(
      { applicationReference: 1, createdAt: -1 },
      { name: "idx_application_history_reference" },
    ),
    collections.anonymousCandidateProfiles.createIndex(
      { anonymousCandidateReference: 1 },
      { unique: true, name: "uniq_anonymous_candidate_reference" },
    ),
    collections.anonymousCandidateProfiles.createIndex(
      { applicationId: 1 },
      { unique: true, name: "uniq_anonymous_profile_application" },
    ),
    collections.anonymousProfileShares.createIndex(
      { shareReference: 1 },
      { unique: true, name: "uniq_anonymous_share_reference" },
    ),
    collections.anonymousProfileShares.createIndex(
      { applicationId: 1, jobId: 1, companyAccountId: 1 },
      { unique: true, name: "uniq_anonymous_share_application_job_company" },
    ),
    collections.interviews.createIndex(
      { interviewReference: 1 },
      { unique: true, name: "uniq_interview_reference" },
    ),
    collections.notifications.createIndex(
      { recipientRole: 1, recipientAccountId: 1, createdAt: -1 },
      { name: "idx_notifications_recipient_created" },
    ),
    collections.consultancyNotes.createIndex(
      { applicationReference: 1, createdAt: -1 },
      { name: "idx_consultancy_notes_application_reference" },
    ),
    collections.activityLogs.createIndex(
      { entityType: 1, entityReference: 1, createdAt: -1 },
      { name: "idx_activity_logs_entity_reference" },
    ),
  ]);
}

function generateResetOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function getResetOtpExpiryDate(now = new Date()) {
  return new Date(now.getTime() + resetOtpExpiryMs);
}

function getForgotPasswordSuccessMessage() {
  return "If an account exists for the selected login type and email, a 6-digit OTP has been sent.";
}

function getResetOtpRetryAfterSeconds(lastRequestedAt, now = new Date()) {
  const requestedAt = lastRequestedAt ? new Date(lastRequestedAt) : null;

  if (!requestedAt || Number.isNaN(requestedAt.getTime())) {
    return resetOtpCooldownSeconds;
  }

  const remainingMs = requestedAt.getTime() + resetOtpCooldownMs - now.getTime();

  if (remainingMs <= 0) {
    return 1;
  }

  return Math.ceil(remainingMs / 1000);
}

function buildResetOtpCooldownFilter(credentialId, now = new Date()) {
  const cooldownCutoff = new Date(now.getTime() - resetOtpCooldownMs);

  return {
    _id: credentialId,
    $or: [
      { resetOtpRequestedAt: { $exists: false } },
      { resetOtpRequestedAt: null },
      { resetOtpRequestedAt: { $lte: cooldownCutoff } },
    ],
  };
}

function buildResetStateClearUpdate(now = new Date(), extraSet = {}) {
  return {
    $set: {
      updatedAt: now,
      ...extraSet,
    },
    $unset: {
      resetOtpHash: "",
      resetOtpExpiresAt: "",
      resetOtpRequestedAt: "",
      resetOtpAttemptCount: "",
    },
  };
}

async function clearResetState(store, credentialId, now = new Date(), extraSet = {}) {
  await store.collection.updateOne(
    { _id: credentialId },
    buildResetStateClearUpdate(now, extraSet),
  );
}

async function clearResetStateForOtpRequest(
  store,
  credentialId,
  requestState,
  now = new Date(),
  extraSet = {},
) {
  const filter = {
    _id: credentialId,
    resetOtpHash: requestState.otpHash,
    resetOtpRequestedAt: requestState.requestedAt,
    resetOtpExpiresAt: requestState.expiresAt,
  };

  await store.collection.updateOne(
    filter,
    buildResetStateClearUpdate(now, extraSet),
  );
}

async function sendResetOtpEmail({ transporter, role, to, name, otp }) {
  const roleLabel = getRoleLabel(role);
  const recipientName = String(name || "").trim() || `${roleLabel} user`;
  const subject = `${roleLabel} password reset OTP`;
  const text = [
    `Hello ${recipientName},`,
    "",
    `Your OTP to reset the password for your ${roleLabel.toLowerCase()} login is ${otp}.`,
    `It will expire in ${resetOtpExpiryMinutes} minutes.`,
    "",
    "If you did not request this reset, you can ignore this email.",
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #12304a;">
      <p>Hello ${recipientName},</p>
      <p>Your OTP to reset the password for your ${roleLabel.toLowerCase()} login is:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 0.28em; margin: 20px 0;">
        ${otp}
      </p>
      <p>This OTP expires in ${resetOtpExpiryMinutes} minutes.</p>
      <p>If you did not request this reset, you can ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject,
    text,
    html,
  });
}

function formatDatabasePublicMessage(error) {
  if (!mongoUri) {
    return "Database is not configured. Add MONGODB_URI to the .env file.";
  }

  const message = String(error?.message || "");

  if (/tlsv1 alert internal error|ssl3_read_bytes|SSL alert number 80/i.test(message)) {
    return "Database connection failed. In MongoDB Atlas, allow this computer's public IP address and verify the connection string.";
  }

  if (/bad auth|authentication failed/i.test(message)) {
    return "Database login failed. Check the MongoDB Atlas username and password in MONGODB_URI.";
  }

  if (/ENOTFOUND|getaddrinfo|querySrv/i.test(message)) {
    return "Database hostname could not be resolved. Verify the MongoDB Atlas connection string.";
  }

  if (isMongoConnectivityError(error)) {
    return "Database connection timed out while reaching MongoDB Atlas. Check Atlas Network Access, confirm the cluster is online, and verify the Vercel connection string.";
  }

  return "Database connection is not ready yet. Check the server logs for details.";
}

function formatCandidateDetailsPublicMessage(error) {
  if (!candidateDetailsMongoUri) {
    return "Candidate details storage is not configured. Add MONGODB_CANDIDATE_DETAILS_URI to the .env file.";
  }

  const message = String(error?.message || "");

  if (/tlsv1 alert internal error|ssl3_read_bytes|SSL alert number 80/i.test(message)) {
    return "Candidate details storage connection failed. In MongoDB Atlas, allow this computer's public IP address and verify the connection string.";
  }

  if (/bad auth|authentication failed/i.test(message)) {
    return "Candidate details storage login failed. Check the MongoDB Atlas username and password in MONGODB_CANDIDATE_DETAILS_URI.";
  }

  if (/ENOTFOUND|getaddrinfo|querySrv/i.test(message)) {
    return "Candidate details storage hostname could not be resolved. Verify the MongoDB Atlas connection string.";
  }

  if (isMongoConnectivityError(error)) {
    return "Candidate details storage timed out while reaching MongoDB Atlas. Check Atlas Network Access, confirm the cluster is online, and verify the Vercel connection string.";
  }

  return "Candidate details storage is not ready yet. Check the server logs for details.";
}

async function getCandidateCount() {
  const detailsStore = getCandidateDetailsStore();

  if (!detailsStore) {
    throw new Error("Candidate profile storage is not ready yet.");
  }

  return detailsStore.collection.countDocuments({
    isVisibleForHiring: { $ne: false },
    profileStatus: { $ne: "deactivated" },
  });
}

function sendSseMessage(response, payload) {
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function writeCompanyDashboardSnapshot(response) {
  const detailsStore = getCandidateDetailsStore();
  const totalCandidates = await getCandidateCount();

  sendSseMessage(response, {
    totalCandidates,
    syncedAt: new Date().toISOString(),
    storage: detailsStore
      ? {
          databaseName: detailsStore.databaseName,
          collectionName: detailsStore.collectionName,
        }
      : null,
  });
}

async function broadcastCompanyDashboardSnapshot() {
  if (companyDashboardClients.size === 0 || !getCandidateDetailsStore()) {
    return;
  }

  const clients = Array.from(companyDashboardClients);

  for (const client of clients) {
    if (client.writableEnded || client.destroyed) {
      companyDashboardClients.delete(client);
      continue;
    }

    try {
      await writeCompanyDashboardSnapshot(client);
    } catch (error) {
      companyDashboardClients.delete(client);
      console.warn("Company dashboard live update failed:", error.message);
    }
  }
}

function sanitizeCredential(credential) {
  const isCandidate = credential.role === "candidate";
  const candidateConsentValue =
    credential.consent === true ||
    (isCandidate && Boolean(credential.consentAcceptedAt));

  return {
    id: String(credential._id),
    role: credential.role,
    name: credential.name || "",
    email: credential.email,
    createdAt: credential.createdAt,
    lastLoginAt: credential.lastLoginAt || null,
    consent: isCandidate ? candidateConsentValue : null,
    consentAcceptedAt: isCandidate ? credential.consentAcceptedAt || null : null,
    consentVersion: isCandidate ? credential.consentVersion || null : null,
    consentSource: isCandidate ? credential.consentSource || null : null,
    updatedAt: credential.updatedAt,
  };
}

async function createAuthSession(req, res, credential) {
  const store = getRecruitmentStore();

  if (!store) {
    throw new Error("Recruitment storage is not ready yet.");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionTtlMs);
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const sessionHash = hashSessionToken(sessionToken);

  await store.collections.sessions.insertOne({
    sessionHash,
    credentialId: credential._id,
    role: credential.role,
    email: credential.email,
    name: credential.name || "",
    createdAt: now,
    updatedAt: now,
    lastSeenAt: now,
    expiresAt,
    userAgent: String(req.headers["user-agent"] || "").slice(0, 512),
    ipAddress: getRequestIpAddress(req),
  });

  setCookie(res, sessionCookieName, sessionToken, {
    maxAge: Math.floor(sessionTtlMs / 1000),
    path: "/",
    sameSite: "Lax",
    secure: secureCookies,
  });

  return {
    expiresAt,
  };
}

async function destroyAuthSession(req, res) {
  const store = getRecruitmentStore();
  const sessionToken = getSessionTokenFromRequest(req);

  if (store && sessionToken) {
    await store.collections.sessions.deleteOne({
      sessionHash: hashSessionToken(sessionToken),
    });
  }

  clearCookie(res, sessionCookieName);
}

async function getAuthenticatedRequestContext(req) {
  const store = getRecruitmentStore();

  if (!store) {
    return null;
  }

  const sessionToken = getSessionTokenFromRequest(req);

  if (!sessionToken) {
    return null;
  }

  const sessionHash = hashSessionToken(sessionToken);
  const now = new Date();
  const inactiveBefore = new Date(now.getTime() - sessionInactivityMs);
  const session = await store.collections.sessions.findOne({
    sessionHash,
    expiresAt: { $gt: now },
    lastSeenAt: { $gt: inactiveBefore },
  });

  if (!session) {
    // Delete expired or idle sessions immediately instead of waiting for MongoDB's TTL monitor.
    await store.collections.sessions.deleteOne({ sessionHash });
    return null;
  }

  const credentialStore = getRoleStore(session.role);
  const credentialId = toObjectId(session.credentialId);

  if (!credentialStore || !credentialId) {
    await store.collections.sessions.deleteOne({ sessionHash });
    return null;
  }

  const credential = await credentialStore.collection.findOne({ _id: credentialId });

  if (!credential) {
    await store.collections.sessions.deleteOne({ sessionHash });
    return null;
  }

  await store.collections.sessions.updateOne(
    { _id: session._id },
    {
      $set: {
        updatedAt: now,
        lastSeenAt: now,
      },
    },
  );

  return {
    session,
    credential,
    credentialStore,
  };
}

async function requireAuthenticatedRole(req, res, requiredRole) {
  const sessionToken = getSessionTokenFromRequest(req);

  if (!sessionToken) {
    clearCookie(res, sessionCookieName);
    res.status(401).json({
      ok: false,
      message: "Please log in again to continue.",
    });
    return null;
  }

  if (!(await ensureDatabaseConnection())) {
    res.status(503).json({
      ok: false,
      message: getDatabaseUnavailableMessage(),
    });
    return null;
  }

  const authContext = await getAuthenticatedRequestContext(req);

  if (!authContext) {
    if (!res.headersSent) {
      clearCookie(res, sessionCookieName);
      res.status(401).json({
        ok: false,
        message: "Please log in again to continue.",
      });
    }
    return null;
  }

  if (requiredRole && authContext.credential.role !== requiredRole) {
    res.status(403).json({
      ok: false,
      message: "You are not allowed to access this resource.",
    });
    return null;
  }

  return authContext;
}

function getCandidateConsentState(credential) {
  return (
    credential?.consent === true ||
    Boolean(credential?.consentAcceptedAt)
  );
}

function buildNotificationDocument({
  recipientRole,
  recipientAccountId,
  recipientEmail = "",
  type,
  title,
  message,
  entityType,
  entityReference,
  visibility = "internal",
}) {
  const now = new Date();

  return {
    recipientRole,
    recipientAccountId: toObjectId(recipientAccountId),
    recipientEmail: recipientEmail || "",
    type,
    title,
    message,
    entityType,
    entityReference,
    visibility,
    readAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function buildNotificationRecipientFilter(authContext, options = {}) {
  const role = authContext?.credential?.role || "";
  const accountId = toObjectId(authContext?.credential?._id);
  const includeGlobal = options.includeGlobal !== false;
  const recipientFilters = [];

  if (accountId) {
    recipientFilters.push({ recipientAccountId: accountId });
  }

  if (includeGlobal) {
    recipientFilters.push({ recipientAccountId: null });
  }

  if (recipientFilters.length === 0) {
    return {
      recipientRole: role,
      recipientAccountId: null,
    };
  }

  if (recipientFilters.length === 1) {
    return {
      recipientRole: role,
      ...recipientFilters[0],
    };
  }

  return {
    recipientRole: role,
    $or: recipientFilters,
  };
}

function serializeNotificationView(notification = {}) {
  return {
    id: String(notification._id || ""),
    type: normalizeLookupKey(notification.type) || "notification",
    title: sanitizeHtmlUnsafeText(notification.title || "Recruitment update"),
    message: sanitizeHtmlUnsafeText(notification.message || "A new portal update is available."),
    entityType: sanitizeHtmlUnsafeText(notification.entityType || ""),
    entityReference: sanitizeHtmlUnsafeText(notification.entityReference || ""),
    createdAt: notification.createdAt || null,
    readAt: notification.readAt || null,
    isRead: Boolean(notification.readAt),
  };
}

async function createNotification(store, payload) {
  await store.collections.notifications.insertOne(buildNotificationDocument(payload));
}

async function writeActivityLog(store, payload) {
  const now = new Date();

  await store.collections.activityLogs.insertOne({
    actorRole: payload.actorRole,
    actorCredentialId: toObjectId(payload.actorCredentialId),
    actorEmail: payload.actorEmail || "",
    entityType: payload.entityType,
    entityReference: payload.entityReference,
    action: payload.action,
    details: payload.details || {},
    createdAt: now,
  });
}

function validateCredentialPayload(
  payload,
  { requirePasswordConfirmation = false, requireCandidateName = false } = {},
) {
  const role = String(payload.role || "").trim().toLowerCase();
  const name = String(payload.name || "").trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const confirmPassword = String(payload.confirmPassword || "");

  if (!roleStorage[role]) {
    return { error: "Choose a valid login type." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (requireCandidateName && role === "candidate" && name.length === 0) {
    return { error: "Enter your full name." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (requirePasswordConfirmation && password !== confirmPassword) {
    return { error: "Password confirmation does not match." };
  }

  return { role, name, email, password };
}

function validateForgotPasswordPayload(payload) {
  const role = String(payload.role || "").trim().toLowerCase();
  const email = normalizeEmail(payload.email);

  if (!roleStorage[role]) {
    return { error: "Choose a valid login type." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  return { role, email };
}

function validateResetPasswordPayload(payload) {
  const otp = String(payload.otp || "").trim();
  const validation = validateCredentialPayload(payload, {
    requirePasswordConfirmation: true,
  });

  if (validation.error) {
    return { error: validation.error };
  }

  if (!/^\d{6}$/.test(otp)) {
    return { error: "Enter the 6-digit OTP sent to your email." };
  }

  return {
    role: validation.role,
    email: validation.email,
    password: validation.password,
    otp,
  };
}

function validateCandidateConsentPayload(payload) {
  const role = String(payload.role || "candidate").trim().toLowerCase();
  const email = normalizeEmail(payload.email);

  if (role !== "candidate") {
    return { error: "Candidate consent is available only for candidate logins." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid candidate email address." };
  }

  return { role, email };
}

function validateCandidateProfileLookupPayload(payload) {
  const email = normalizeEmail(payload.email);

  if (!isValidEmail(email)) {
    return { error: "Enter a valid candidate email address." };
  }

  return { email };
}

function validateCandidateProfileStatusPayload(payload) {
  const lookup = validateCandidateProfileLookupPayload(payload);

  if (lookup.error) {
    return lookup;
  }

  if (typeof payload.isVisibleForHiring !== "boolean") {
    return { error: "Choose a valid candidate profile visibility state." };
  }

  return {
    email: lookup.email,
    isVisibleForHiring: payload.isVisibleForHiring,
  };
}

function normalizeProfileRecord(record, fields) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }

  return fields.reduce((normalized, field) => {
    const value = record[field];
    normalized[field] = typeof value === "boolean" ? value : normalizeTextValue(value).slice(0, 2000);
    return normalized;
  }, {});
}

function normalizeCandidateProfileData(profileData, candidateType) {
  if (profileData === undefined || profileData === null) {
    return { profileData: null };
  }
  if (typeof profileData !== "object" || Array.isArray(profileData)) {
    return { error: "Candidate profile details must use a valid structured format." };
  }

  const lists = ["education", "projects", "certifications", "internships", "previousEmployment"];
  for (const key of lists) {
    if (profileData[key] !== undefined && !Array.isArray(profileData[key])) return { error: `${key} must be a list of valid records.` };
    if (Array.isArray(profileData[key]) && profileData[key].length > 12) return { error: `A maximum of 12 ${key} records is allowed.` };
  }
  const normalizeList = (key, fields) => (profileData[key] || []).map((record) => normalizeProfileRecord(record, fields)).filter(Boolean).filter((record) => Object.values(record).some((value) => value === true || String(value).trim()));
  const personal = normalizeProfileRecord(profileData.personal, ["fullName", "email", "phone", "alternatePhone", "dateOfBirth", "gender", "address", "city", "state", "country", "pinCode"]) || {};
  const skills = normalizeProfileRecord(profileData.skills, ["primary", "secondary", "tools", "languages"]) || {};
  const preferences = normalizeProfileRecord(profileData.preferences, ["preferredRole", "secondaryRole", "department", "industry", "workLocation", "willingToRelocate", "workMode", "employmentType", "joiningDate", "internshipInterest", "expectedSalary"]) || {};
  const education = normalizeList("education", ["qualification", "degree", "specialization", "institution", "board", "startYear", "completionYear", "score", "status"]);
  const projects = normalizeList("projects", ["title", "description", "role", "technologies", "startDate", "endDate", "url"]);
  const certifications = normalizeList("certifications", ["name", "organization", "issueDate", "expiryDate", "doesNotExpire", "credentialId", "credentialUrl"]);
  const internships = normalizeList("internships", ["organization", "role", "type", "startDate", "endDate", "ongoing", "responsibilities", "skillsLearned"]);
  const previousEmployment = normalizeList("previousEmployment", ["company", "designation", "startDate", "endDate", "employmentType", "industry", "department", "description", "responsibilities", "reasonForLeaving"]);
  const currentEmployment = normalizeProfileRecord(profileData.currentEmployment, ["currentlyUnemployed", "company", "designation", "startDate", "city", "workMode", "industry", "department", "domain", "employmentType", "responsibilities"]) || {};
  const experience = normalizeProfileRecord(profileData.experience, ["totalYears", "totalMonths", "relevantYears", "relevantMonths", "primaryDomain", "secondaryDomain", "achievements", "teamSize", "reportingLevel"]) || {};
  const compensation = normalizeProfileRecord(profileData.compensation, ["currentCtc", "expectedCtc", "currency", "noticePeriod", "servingNotice", "lastWorkingDate", "immediateJoiner", "reasonForChange"]) || {};
  const validUrl = (value) => !value || /^https?:\/\/[^\s]+$/i.test(value);
  if ([...projects, ...certifications].some((record) => !validUrl(record.url || record.credentialUrl))) return { error: "Enter valid project or credential URLs." };
  if (education.some((record) => record.completionYear && Number(record.completionYear) < Number(record.startYear))) return { error: "Education completion year cannot be earlier than start year." };
  if ([...projects, ...certifications, ...internships, ...previousEmployment].some((record) => record.endDate && record.startDate && record.endDate < record.startDate)) return { error: "An end date cannot be earlier than its start date." };
  const totalMonths = Number(experience.totalYears || 0) * 12 + Number(experience.totalMonths || 0);
  const relevantMonths = Number(experience.relevantYears || 0) * 12 + Number(experience.relevantMonths || 0);
  if (totalMonths < 0 || relevantMonths < 0 || Number(experience.totalMonths || 0) > 11 || Number(experience.relevantMonths || 0) > 11 || relevantMonths > totalMonths) return { error: "Enter valid total and relevant experience values." };
  if ([compensation.currentCtc, compensation.expectedCtc, preferences.expectedSalary].some((value) => value && (!Number.isFinite(Number(value)) || Number(value) < 0))) return { error: "Salary values must be non-negative numbers." };
  const primarySkills = String(skills.primary || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (primarySkills.length && new Set(primarySkills).size !== primarySkills.length) return { error: "Duplicate primary skills are not allowed." };
  if (candidateType === "fresher" && education.length && education.some((record) => !record.qualification || !record.institution || !record.startYear)) return { error: "Complete the required qualification, institution, and start year for each education record." };
  if (candidateType === "experienced" && !currentEmployment.currentlyUnemployed && (currentEmployment.company || currentEmployment.designation) && (!currentEmployment.company || !currentEmployment.designation)) return { error: "Complete both current company and designation." };
  return { profileData: { personal, skills, preferences, education, projects, certifications, internships, currentEmployment, previousEmployment, experience, compensation } };
}

function validateCandidateProfilePayload(payload) {
  const candidateType = normalizeTextValue(payload.candidateType).toLowerCase();
  const fullName = normalizeTextValue(payload.fullName);
  const email = normalizeEmail(payload.email);
  const phone = normalizeTextValue(payload.phone);
  const location = normalizeTextValue(payload.location);
  const preferredRole = normalizeTextValue(payload.preferredRole);
  const preferredWorkLocation = normalizeTextValue(payload.preferredWorkLocation);
  const skills = normalizeTextValue(payload.skills);
  const summary = normalizeTextValue(payload.summary);

  if (!["fresher", "experienced"].includes(candidateType)) {
    return { error: "Choose whether you are a fresher or an experienced candidate." };
  }

  if (fullName.length === 0) {
    return { error: "Enter your full name." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (phone.length < 8) {
    return { error: "Enter a valid phone number." };
  }

  if (location.length === 0) {
    return { error: "Enter your current location." };
  }

  if (preferredRole.length === 0) {
    return { error: "Enter your preferred role." };
  }

  if (skills.length === 0) {
    return { error: "Enter your key skills." };
  }

  if (summary.length === 0) {
    return { error: "Enter your professional summary." };
  }

  const expandedProfile = normalizeCandidateProfileData(payload.profileData, candidateType);

  if (expandedProfile.error) {
    return { error: expandedProfile.error };
  }

  const baseProfile = {
    candidateType,
    fullName,
    email,
    phone,
    location,
    preferredRole,
    preferredWorkLocation,
    skills,
    skillList: skills
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    summary,
    profileData: expandedProfile.profileData,
  };

  if (candidateType === "fresher") {
    const highestQualification = normalizeTextValue(payload.highestQualification);
    const specialization = normalizeTextValue(payload.specialization);
    const collegeName = normalizeTextValue(payload.collegeName);
    const graduationYear = normalizeTextValue(payload.graduationYear);
    const internshipTraining = normalizeTextValue(payload.internshipTraining);
    const fresherPreferredRole = normalizeTextValue(payload.fresherPreferredRole);
    const projectHighlights = normalizeTextValue(payload.projectHighlights);
    const certifications = normalizeTextValue(payload.certifications);

    if (highestQualification.length === 0) {
      return { error: "Enter your highest qualification." };
    }

    if (collegeName.length === 0) {
      return { error: "Enter your college or institute name." };
    }

    if (graduationYear.length === 0) {
      return { error: "Enter your graduation year." };
    }

    return {
      ...baseProfile,
      fresherDetails: {
        highestQualification,
        specialization,
        collegeName,
        graduationYear,
        internshipTraining,
        fresherPreferredRole,
        projectHighlights,
        certifications,
      },
      experiencedDetails: null,
    };
  }

  const currentCompany = normalizeTextValue(payload.currentCompany);
  const currentRole = normalizeTextValue(payload.currentRole);
  const totalExperience = normalizeTextValue(payload.totalExperience);
  const relevantExperience = normalizeTextValue(payload.relevantExperience);
  const currentCtc = normalizeTextValue(payload.currentCtc);
  const expectedCtc = normalizeTextValue(payload.expectedCtc);
  const noticePeriod = normalizeTextValue(payload.noticePeriod);
  const industryDomain = normalizeTextValue(payload.industryDomain);
  const careerAchievements = normalizeTextValue(payload.careerAchievements);
  const reasonForChange = normalizeTextValue(payload.reasonForChange);

  if (currentCompany.length === 0) {
    return { error: "Enter your current or last company name." };
  }

  if (currentRole.length === 0) {
    return { error: "Enter your current role." };
  }

  if (totalExperience.length === 0) {
    return { error: "Enter your total experience." };
  }

  if (noticePeriod.length === 0) {
    return { error: "Enter your notice period." };
  }

  return {
    ...baseProfile,
    fresherDetails: null,
    experiencedDetails: {
      currentCompany,
      currentRole,
      totalExperience,
      relevantExperience,
      currentCtc,
      expectedCtc,
      noticePeriod,
      industryDomain,
      careerAchievements,
      reasonForChange,
    },
  };
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalizedValue = String(value || "").trim().toLowerCase();

  if (["true", "1", "yes", "y", "on"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "no", "n", "off"].includes(normalizedValue)) {
    return false;
  }

  return null;
}

function buildTextSearchRegex(value) {
  const normalizedValue = normalizeTextValue(value);

  if (!normalizedValue) {
    return null;
  }

  return {
    $regex: escapeRegexPattern(normalizedValue),
    $options: "i",
  };
}

function toStartOfDay(date = new Date()) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function isDateInFuture(value) {
  const date = coerceDateValue(value);

  if (!date) {
    return false;
  }

  return date.getTime() >= toStartOfDay().getTime();
}

function buildJobStatusHistoryDocument({
  jobId,
  jobReference,
  previousStatus,
  nextStatus,
  actorRole,
  actorCredentialId,
  actorEmail,
  note = "",
}) {
  const now = new Date();

  return {
    jobId: toObjectId(jobId),
    jobReference,
    previousStatus: previousStatus || null,
    nextStatus,
    actorRole,
    actorCredentialId: toObjectId(actorCredentialId),
    actorEmail: actorEmail || "",
    note: sanitizeOptionalText(note),
    createdAt: now,
    updatedAt: now,
  };
}

function buildApplicationStatusHistoryDocument({
  applicationId,
  applicationReference,
  previousStatus,
  nextStatus,
  actorRole,
  actorCredentialId,
  actorEmail,
  note = "",
}) {
  const now = new Date();

  return {
    applicationId: toObjectId(applicationId),
    applicationReference,
    previousStatus: previousStatus || null,
    nextStatus,
    actorRole,
    actorCredentialId: toObjectId(actorCredentialId),
    actorEmail: actorEmail || "",
    note: sanitizeOptionalText(note),
    createdAt: now,
    updatedAt: now,
  };
}

function getCandidateQualificationValue(profile) {
  if (!profile) {
    return null;
  }

  if (profile.candidateType === "fresher") {
    const qualification = sanitizeOptionalText(profile.fresherDetails?.highestQualification);
    const specialization = sanitizeOptionalText(profile.fresherDetails?.specialization);
    return [qualification, specialization].filter(Boolean).join(" - ") || qualification || null;
  }

  return sanitizeOptionalText(profile.experiencedDetails?.industryDomain) || null;
}

function getCandidateExperienceSummary(profile) {
  if (!profile) {
    return null;
  }

  if (profile.candidateType === "experienced") {
    return sanitizeOptionalText(profile.experiencedDetails?.totalExperience) || null;
  }

  return "Fresher";
}

function getCandidateRelevantExperienceSummary(profile) {
  if (!profile) {
    return null;
  }

  if (profile.candidateType === "experienced") {
    return sanitizeOptionalText(profile.experiencedDetails?.relevantExperience) || null;
  }

  return sanitizeOptionalText(profile.fresherDetails?.internshipTraining) || null;
}

function buildCandidateProfileSnapshot(profile) {
  return {
    candidateType: profile.candidateType || "",
    preferredRole: profile.preferredRole || "",
    preferredWorkLocation: profile.preferredWorkLocation || "",
    location: profile.location || "",
    skills: profile.skills || "",
    skillList: Array.isArray(profile.skillList) ? profile.skillList : [],
    summary: profile.summary || "",
    qualification: getCandidateQualificationValue(profile),
    totalExperience: getCandidateExperienceSummary(profile),
    relevantExperience: getCandidateRelevantExperienceSummary(profile),
    noticePeriod:
      sanitizeOptionalText(profile.experiencedDetails?.noticePeriod) || "Not provided",
    expectedSalaryRange:
      sanitizeOptionalText(profile.experiencedDetails?.expectedCtc) || "Not provided",
    highestQualification:
      sanitizeOptionalText(profile.fresherDetails?.highestQualification) || null,
    specialization:
      sanitizeOptionalText(profile.fresherDetails?.specialization) || null,
    industryDomain:
      sanitizeOptionalText(profile.experiencedDetails?.industryDomain) || null,
    capturedAt: new Date(),
  };
}

function buildAnonymousCandidateSummaryFromProfile(profile, application, payload = {}) {
  const approvedComment = sanitizeOptionalText(payload.approvedComment);
  const screeningResult = sanitizeOptionalText(payload.screeningResult);

  return {
    candidateType: profile.candidateType,
    qualification: sanitizeOptionalText(payload.qualification) || getCandidateQualificationValue(profile),
    experienceRange:
      sanitizeOptionalText(payload.experienceRange) ||
      application?.candidateProfileSnapshot?.totalExperience ||
      getCandidateExperienceSummary(profile) ||
      "Not provided",
    relevantExperience:
      sanitizeOptionalText(payload.relevantExperience) ||
      application?.candidateProfileSnapshot?.relevantExperience ||
      getCandidateRelevantExperienceSummary(profile) ||
      "Not provided",
    skills:
      sanitizeOptionalText(payload.skills) ||
      application?.candidateProfileSnapshot?.skills ||
      profile.skills ||
      "",
    currentLocation:
      sanitizeOptionalText(payload.currentLocation) ||
      application?.candidateProfileSnapshot?.location ||
      profile.location ||
      "",
    preferredLocation:
      sanitizeOptionalText(payload.preferredLocation) ||
      application?.candidateProfileSnapshot?.preferredWorkLocation ||
      profile.preferredWorkLocation ||
      "",
    preferredRole:
      sanitizeOptionalText(payload.preferredRole) ||
      application?.candidateProfileSnapshot?.preferredRole ||
      profile.preferredRole ||
      "",
    noticePeriod:
      sanitizeOptionalText(payload.noticePeriod) ||
      application?.candidateProfileSnapshot?.noticePeriod ||
      sanitizeOptionalText(profile.experiencedDetails?.noticePeriod) ||
      "Not provided",
    expectedSalaryRange:
      sanitizeOptionalText(payload.expectedSalaryRange) ||
      application?.candidateProfileSnapshot?.expectedSalaryRange ||
      sanitizeOptionalText(profile.experiencedDetails?.expectedCtc) ||
      "Not provided",
    consultancyScreeningResult: screeningResult || "Pending consultancy review",
    approvedComment: approvedComment || "",
  };
}

function isCandidateProfileEligibleForHiring(profile) {
  if (!profile) {
    return false;
  }

  return (
    profile.isVisibleForHiring === true &&
    String(profile.profileStatus || "").trim().toLowerCase() === "active"
  );
}

function validateCandidateAccessForRecruitment(credential, profile) {
  if (!credential) {
    return { error: "Please log in again to continue." };
  }

  if (!getCandidateConsentState(credential)) {
    return {
      error: "Candidate consent must be approved before continuing with recruitment actions.",
    };
  }

  if (!profile) {
    return {
      error: "Complete your candidate profile before continuing.",
    };
  }

  if (!isCandidateProfileEligibleForHiring(profile)) {
    return {
      error:
        "Your profile is currently not active for hiring. Reactivate it before showing interest or applying.",
    };
  }

  return { ok: true };
}

function validateJobPayload(payload, { requireComplete = false } = {}) {
  const title = normalizeTextValue(payload.title);
  const department = normalizeTextValue(payload.department);
  const description = normalizeTextValue(payload.description);
  const rolesAndResponsibilities = parseDelimitedList(payload.responsibilities || payload.rolesAndResponsibilities);
  const requiredSkills = parseDelimitedList(payload.requiredSkills);
  const preferredSkills = parseDelimitedList(payload.preferredSkills);
  const minimumExperience = sanitizeOptionalNumber(payload.minimumExperience);
  const maximumExperience = sanitizeOptionalNumber(payload.maximumExperience);
  const qualification = normalizeTextValue(payload.qualification);
  const location = normalizeTextValue(payload.location);
  const workMode = normalizeLookupKey(payload.workMode);
  const employmentType = normalizeLookupKey(payload.employmentType);
  const salaryMinimum = sanitizeOptionalNumber(payload.salaryMinimum);
  const salaryMaximum = sanitizeOptionalNumber(payload.salaryMaximum);
  const showSalaryToCandidate = normalizeBoolean(payload.showSalaryToCandidate) === true;
  const openings = Number(payload.openings || 0);
  const shiftDetails = normalizeTextValue(payload.shiftDetails);
  const noticePeriodPreference = normalizeTextValue(payload.noticePeriodPreference);
  const applicationDeadline = coerceDateValue(payload.applicationDeadline);
  const screeningQuestions = parseDelimitedList(payload.screeningQuestions).map((question, index) => ({
    id: `SQ-${index + 1}`,
    question,
  }));
  const candidateAudience = normalizeLookupKey(payload.candidateAudience || "all") || "all";
  const industry = normalizeTextValue(payload.industry);
  const additionalInformation = normalizeTextValue(payload.additionalInformation);
  const internalCompanyNote = normalizeTextValue(payload.internalCompanyNote);
  const closureRequestReason = normalizeTextValue(payload.closureRequestReason);

  if (!title) {
    return { error: "Enter the job title." };
  }

  if (requireComplete && !department) {
    return { error: "Enter the department." };
  }

  if (!description) {
    return { error: "Enter the job description." };
  }

  if (requireComplete && requiredSkills.length === 0) {
    return { error: "Add at least one required skill." };
  }

  if (requireComplete && !qualification) {
    return { error: "Enter the qualification requirement." };
  }

  if (!location) {
    return { error: "Enter the job location." };
  }

  if (!workModeValues.includes(workMode)) {
    return { error: "Choose a valid work mode." };
  }

  if (!employmentTypeValues.includes(employmentType)) {
    return { error: "Choose a valid employment type." };
  }

  if (!Number.isInteger(openings) || openings < 1) {
    return { error: "Enter a valid number of openings." };
  }

  if (minimumExperience !== null && minimumExperience < 0) {
    return { error: "Minimum experience cannot be negative." };
  }

  if (maximumExperience !== null && maximumExperience < 0) {
    return { error: "Maximum experience cannot be negative." };
  }

  if (
    minimumExperience !== null &&
    maximumExperience !== null &&
    maximumExperience < minimumExperience
  ) {
    return { error: "Maximum experience must be greater than or equal to minimum experience." };
  }

  if (salaryMinimum !== null && salaryMaximum !== null && salaryMaximum < salaryMinimum) {
    return { error: "Salary maximum must be greater than or equal to salary minimum." };
  }

  if (!candidateAudienceValues.includes(candidateAudience)) {
    return { error: "Choose a valid candidate audience." };
  }

  if (requireComplete && !applicationDeadline) {
    return { error: "Choose a valid application deadline." };
  }

  if (applicationDeadline && !isDateInFuture(applicationDeadline)) {
    return { error: "Application deadline must be today or a future date." };
  }

  return {
    title,
    department,
    description,
    responsibilities: rolesAndResponsibilities,
    requiredSkills,
    preferredSkills,
    minimumExperience,
    maximumExperience,
    qualification,
    location,
    workMode,
    employmentType,
    salaryMinimum,
    salaryMaximum,
    showSalaryToCandidate,
    openings,
    shiftDetails,
    noticePeriodPreference,
    applicationDeadline,
    screeningQuestions,
    candidateAudience,
    industry,
    additionalInformation,
    internalCompanyNote,
    closureRequestReason,
  };
}

function buildInternalJobDocument(payload, companyCredential, existingJob = {}) {
  const now = new Date();
  const companyDisplayName = formatAccountDisplayName(
    companyCredential.name,
    companyCredential.email,
    "Company Account",
  );

  return {
    companyAccountId: companyCredential._id,
    companyEmail: companyCredential.email,
    companyName: companyCredential.name || "",
    companyDisplayName,
    title: payload.title,
    department: payload.department,
    description: payload.description,
    responsibilities: payload.responsibilities,
    requiredSkills: payload.requiredSkills,
    preferredSkills: payload.preferredSkills,
    minimumExperience: payload.minimumExperience,
    maximumExperience: payload.maximumExperience,
    qualification: payload.qualification,
    location: payload.location,
    workMode: payload.workMode,
    employmentType: payload.employmentType,
    salaryMinimum: payload.salaryMinimum,
    salaryMaximum: payload.salaryMaximum,
    showSalaryToCandidate: payload.showSalaryToCandidate,
    openings: payload.openings,
    shiftDetails: payload.shiftDetails,
    noticePeriodPreference: payload.noticePeriodPreference,
    applicationDeadline: payload.applicationDeadline,
    screeningQuestions: payload.screeningQuestions,
    candidateAudience: payload.candidateAudience,
    industry: payload.industry,
    additionalInformation: payload.additionalInformation,
    internalCompanyNote: payload.internalCompanyNote,
    updatedAt: now,
    createdAt: existingJob.createdAt || now,
  };
}

function toJobValidationPayload(job = {}) {
  return {
    title: job.title || "",
    department: job.department || "",
    description: job.description || "",
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "",
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(", ") : "",
    preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills.join(", ") : "",
    minimumExperience: job.minimumExperience ?? "",
    maximumExperience: job.maximumExperience ?? "",
    qualification: job.qualification || "",
    location: job.location || "",
    workMode: job.workMode || "",
    employmentType: job.employmentType || "",
    salaryMinimum: job.salaryMinimum ?? "",
    salaryMaximum: job.salaryMaximum ?? "",
    showSalaryToCandidate: job.showSalaryToCandidate === true,
    openings: job.openings ?? 1,
    shiftDetails: job.shiftDetails || "",
    noticePeriodPreference: job.noticePeriodPreference || "",
    applicationDeadline: job.applicationDeadline || "",
    screeningQuestions: Array.isArray(job.screeningQuestions)
      ? job.screeningQuestions.map((question) => question.question || question).join("\n")
      : "",
    candidateAudience: job.candidateAudience || "all",
    industry: job.industry || "",
    additionalInformation: job.additionalInformation || "",
    internalCompanyNote: job.internalCompanyNote || "",
  };
}

function buildPublicJobViewDocument(job, overrides = {}) {
  const mergedView = {
    title: sanitizeHtmlUnsafeText(overrides.title ?? job.title),
    department: sanitizeHtmlUnsafeText(overrides.department ?? job.department),
    description: sanitizeHtmlUnsafeText(overrides.description ?? job.description),
    responsibilities: Array.isArray(overrides.responsibilities)
      ? overrides.responsibilities.map(sanitizeHtmlUnsafeText).filter(Boolean)
      : Array.isArray(job.responsibilities)
        ? job.responsibilities.map(sanitizeHtmlUnsafeText).filter(Boolean)
        : [],
    requiredSkills: Array.isArray(overrides.requiredSkills)
      ? overrides.requiredSkills.map(sanitizeHtmlUnsafeText).filter(Boolean)
      : Array.isArray(job.requiredSkills)
        ? job.requiredSkills.map(sanitizeHtmlUnsafeText).filter(Boolean)
        : [],
    preferredSkills: Array.isArray(overrides.preferredSkills)
      ? overrides.preferredSkills.map(sanitizeHtmlUnsafeText).filter(Boolean)
      : Array.isArray(job.preferredSkills)
        ? job.preferredSkills.map(sanitizeHtmlUnsafeText).filter(Boolean)
        : [],
    qualification: sanitizeHtmlUnsafeText(overrides.qualification ?? job.qualification),
    location: sanitizeHtmlUnsafeText(overrides.location ?? job.location),
    workMode: overrides.workMode ?? job.workMode,
    employmentType: overrides.employmentType ?? job.employmentType,
    salaryMinimum: job.showSalaryToCandidate ? job.salaryMinimum : null,
    salaryMaximum: job.showSalaryToCandidate ? job.salaryMaximum : null,
    showSalaryToCandidate: job.showSalaryToCandidate === true,
    openings: Number(job.openings || 0),
    shiftDetails: sanitizeHtmlUnsafeText(overrides.shiftDetails ?? job.shiftDetails),
    noticePeriodPreference: sanitizeHtmlUnsafeText(
      overrides.noticePeriodPreference ?? job.noticePeriodPreference,
    ),
    applicationDeadline: overrides.applicationDeadline ?? job.applicationDeadline ?? null,
    screeningQuestions: Array.isArray(overrides.screeningQuestions)
      ? overrides.screeningQuestions
      : Array.isArray(job.screeningQuestions)
        ? job.screeningQuestions
        : [],
    candidateAudience: overrides.candidateAudience ?? job.candidateAudience ?? "all",
    industry: sanitizeHtmlUnsafeText(overrides.industry ?? job.industry),
    additionalInformation: sanitizeHtmlUnsafeText(
      overrides.additionalInformation ?? job.additionalInformation,
    ),
  };

  return {
    jobId: toObjectId(job._id),
    jobReference: job.jobReference,
    currentStatus: "published",
    title: mergedView.title,
    department: mergedView.department,
    description: mergedView.description,
    responsibilities: mergedView.responsibilities,
    requiredSkills: mergedView.requiredSkills,
    preferredSkills: mergedView.preferredSkills,
    minimumExperience: job.minimumExperience ?? null,
    maximumExperience: job.maximumExperience ?? null,
    qualification: mergedView.qualification,
    location: mergedView.location,
    workMode: mergedView.workMode,
    employmentType: mergedView.employmentType,
    salaryMinimum: mergedView.showSalaryToCandidate ? job.salaryMinimum ?? null : null,
    salaryMaximum: mergedView.showSalaryToCandidate ? job.salaryMaximum ?? null : null,
    showSalaryToCandidate: mergedView.showSalaryToCandidate,
    openings: mergedView.openings,
    shiftDetails: mergedView.shiftDetails,
    noticePeriodPreference: mergedView.noticePeriodPreference,
    applicationDeadline: mergedView.applicationDeadline,
    screeningQuestions: mergedView.screeningQuestions.map((question, index) => ({
      id: question.id || `SQ-${index + 1}`,
      question: sanitizeHtmlUnsafeText(question.question || question),
    })),
    candidateAudience: mergedView.candidateAudience,
    industry: mergedView.industry,
    additionalInformation: mergedView.additionalInformation,
    publishedAt: job.publishedAt || new Date(),
    updatedAt: new Date(),
  };
}

function buildCandidateJobView(job, options = {}) {
  if (!job) {
    return null;
  }

  return {
    jobReference: job.jobReference,
    title: job.title,
    department: job.department || "",
    description: job.description,
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills : [],
    minimumExperience: job.minimumExperience ?? null,
    maximumExperience: job.maximumExperience ?? null,
    qualification: job.qualification || "",
    location: job.location || "",
    workMode: job.workMode || "",
    employmentType: job.employmentType || "",
    salaryMinimum: job.showSalaryToCandidate ? job.salaryMinimum ?? null : null,
    salaryMaximum: job.showSalaryToCandidate ? job.salaryMaximum ?? null : null,
    showSalaryToCandidate: job.showSalaryToCandidate === true,
    openings: Number(job.openings || 0),
    shiftDetails: job.shiftDetails || "",
    noticePeriodPreference: job.noticePeriodPreference || "",
    applicationDeadline: job.applicationDeadline || null,
    screeningQuestions: Array.isArray(job.screeningQuestions)
      ? job.screeningQuestions.map((question, index) => ({
          id: question.id || `SQ-${index + 1}`,
          question: question.question || "",
        }))
      : [],
    candidateAudience: job.candidateAudience || "all",
    industry: job.industry || "",
    additionalInformation: job.additionalInformation || "",
    publishedAt: job.publishedAt || null,
    updatedAt: job.updatedAt || null,
    isInterestRegistered: options.isInterestRegistered === true,
    isApplied: options.isApplied === true,
    applicationReference: options.applicationReference || null,
  };
}

function summarizeApplicationStatusCounts(statusCounts = {}) {
  const totalApplications = Object.values(statusCounts).reduce(
    (sum, count) => sum + Number(count || 0),
    0,
  );
  const underReview = [
    "application_submitted",
    "under_consultancy_review",
    "additional_information_required",
    "consultancy_screening",
    "company_review_pending",
    "on_hold",
  ].reduce((sum, key) => sum + Number(statusCounts[key] || 0), 0);
  const shortlisted = [
    "consultancy_shortlisted",
    "anonymous_profile_shared_with_company",
    "company_review_pending",
    "company_selected_for_interview",
    "interview_coordination",
    "interview_scheduled",
    "interview_completed",
    "offer_discussion",
    "selected",
    "joined",
  ].reduce((sum, key) => sum + Number(statusCounts[key] || 0), 0);
  const anonymousProfilesShared = Number(statusCounts.anonymous_profile_shared_with_company || 0);
  const interviewCount = [
    "company_selected_for_interview",
    "interview_coordination",
    "interview_scheduled",
    "interview_completed",
    "offer_discussion",
    "selected",
    "joined",
  ].reduce((sum, key) => sum + Number(statusCounts[key] || 0), 0);
  const selectedCount = Number(statusCounts.selected || 0) + Number(statusCounts.joined || 0);
  const joinedCount = Number(statusCounts.joined || 0);

  return {
    totalApplications,
    underReview,
    shortlisted,
    anonymousProfilesShared,
    interviewCount,
    selectedCount,
    joinedCount,
  };
}

function buildCompanyJobView(job, metrics = {}) {
  return {
    jobReference: job.jobReference,
    title: job.title,
    department: job.department || "",
    status: job.status,
    statusLabel: getJobStatusLabel(job.status),
    location: job.location || "",
    workMode: job.workMode || "",
    employmentType: job.employmentType || "",
    openings: Number(job.openings || 0),
    applicationDeadline: job.applicationDeadline || null,
    publishedAt: job.publishedAt || null,
    submittedAt: job.submittedAt || null,
    approvedAt: job.approvedAt || null,
    updatedAt: job.updatedAt || null,
    createdAt: job.createdAt || null,
    reviewComments: job.reviewComments || "",
    closureRequestedAt: job.closureRequestedAt || null,
    metrics: {
      interestCount: Number(metrics.interestCount || 0),
      applicationCount: Number(metrics.applicationCount || 0),
      underReviewCount: Number(metrics.underReviewCount || 0),
      shortlistedCount: Number(metrics.shortlistedCount || 0),
      anonymousProfilesSharedCount: Number(metrics.anonymousProfilesSharedCount || 0),
      interviewCount: Number(metrics.interviewCount || 0),
      selectedCount: Number(metrics.selectedCount || 0),
      joinedCount: Number(metrics.joinedCount || 0),
    },
  };
}

function buildConsultancyJobView(job, publicView = null, metrics = {}) {
  return {
    jobReference: job.jobReference,
    companyAccountId: String(job.companyAccountId || ""),
    companyDisplayName: job.companyDisplayName || "",
    companyName: job.companyName || "",
    companyEmail: job.companyEmail || "",
    title: job.title,
    department: job.department || "",
    description: job.description,
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills : [],
    minimumExperience: job.minimumExperience ?? null,
    maximumExperience: job.maximumExperience ?? null,
    qualification: job.qualification || "",
    location: job.location || "",
    workMode: job.workMode || "",
    employmentType: job.employmentType || "",
    salaryMinimum: job.salaryMinimum ?? null,
    salaryMaximum: job.salaryMaximum ?? null,
    showSalaryToCandidate: job.showSalaryToCandidate === true,
    openings: Number(job.openings || 0),
    shiftDetails: job.shiftDetails || "",
    noticePeriodPreference: job.noticePeriodPreference || "",
    applicationDeadline: job.applicationDeadline || null,
    screeningQuestions: Array.isArray(job.screeningQuestions) ? job.screeningQuestions : [],
    candidateAudience: job.candidateAudience || "all",
    industry: job.industry || "",
    additionalInformation: job.additionalInformation || "",
    internalCompanyNote: job.internalCompanyNote || "",
    consultancyNotes: job.consultancyNotes || "",
    status: job.status,
    statusLabel: getJobStatusLabel(job.status),
    reviewComments: job.reviewComments || "",
    identityRiskDetected: job.identityRiskDetected === true,
    createdAt: job.createdAt || null,
    updatedAt: job.updatedAt || null,
    submittedAt: job.submittedAt || null,
    approvedAt: job.approvedAt || null,
    publishedAt: job.publishedAt || null,
    publicView: publicView ? buildCandidateJobView(publicView) : null,
    metrics: {
      interestCount: Number(metrics.interestCount || 0),
      applicationCount: Number(metrics.applicationCount || 0),
      underReviewCount: Number(metrics.underReviewCount || 0),
      shortlistedCount: Number(metrics.shortlistedCount || 0),
      anonymousProfilesSharedCount: Number(metrics.anonymousProfilesSharedCount || 0),
      interviewCount: Number(metrics.interviewCount || 0),
      selectedCount: Number(metrics.selectedCount || 0),
      joinedCount: Number(metrics.joinedCount || 0),
    },
  };
}

function buildCandidateApplicationView(application, job = null) {
  return {
    applicationReference: application.applicationReference,
    jobReference: application.jobReference,
    currentStatus: application.currentStatus,
    statusLabel:
      candidateFriendlyStatusLabels[application.currentStatus] ||
      getJobStatusLabel(application.currentStatus),
    candidateType: application.candidateType,
    screeningAnswers: Array.isArray(application.screeningAnswers)
      ? application.screeningAnswers
      : [],
    appliedAt: application.appliedAt || null,
    updatedAt: application.updatedAt || null,
    withdrawnAt: application.withdrawnAt || null,
    job: job
      ? {
          jobReference: job.jobReference,
          title: job.title,
          location: job.location || "",
          workMode: job.workMode || "",
          employmentType: job.employmentType || "",
          applicationDeadline: job.applicationDeadline || null,
        }
      : null,
  };
}

function buildCompanyAnonymousCandidateView(share, anonymousProfile = null, application = null) {
  return {
    shareReference: share.shareReference,
    applicationReference: application?.applicationReference || share.applicationReference || "",
    sharedAt: share.sharedAt || null,
    anonymousCandidateReference:
      anonymousProfile?.anonymousCandidateReference || share.anonymousCandidateReference || "",
    candidateType: anonymousProfile?.candidateType || application?.candidateType || "",
    qualification: anonymousProfile?.qualification || "Not provided",
    experienceRange: anonymousProfile?.experienceRange || "Not provided",
    relevantExperience: anonymousProfile?.relevantExperience || "Not provided",
    skills: anonymousProfile?.skills || "Not provided",
    currentLocation: anonymousProfile?.currentLocation || "Not provided",
    preferredLocation: anonymousProfile?.preferredLocation || "Not provided",
    preferredRole: anonymousProfile?.preferredRole || "Not provided",
    noticePeriod: anonymousProfile?.noticePeriod || "Not provided",
    expectedSalaryRange: anonymousProfile?.expectedSalaryRange || "Not provided",
    consultancyScreeningResult:
      anonymousProfile?.consultancyScreeningResult || "Pending consultancy update",
    approvedComment: anonymousProfile?.approvedComment || "",
    currentStatus:
      companyVisibleStatusLabels[application?.currentStatus] ||
      getJobStatusLabel(application?.currentStatus),
  };
}

function buildCandidateJobFilter(query = {}, candidateType = "") {
  const filters = [
    { currentStatus: { $in: Array.from(publicJobVisibleStatuses) } },
    { applicationDeadline: { $gte: toStartOfDay() } },
  ];
  const qRegex = buildTextSearchRegex(query.q);
  const locationRegex = buildTextSearchRegex(query.location);
  const workMode = normalizeLookupKey(query.workMode);
  const employmentType = normalizeLookupKey(query.employmentType);
  const skillsRegex = buildTextSearchRegex(query.skills);
  const audience = normalizeLookupKey(query.candidateType || candidateType);

  if (qRegex) {
    filters.push({
      $or: [
        { title: qRegex },
        { description: qRegex },
        { requiredSkills: qRegex },
        { preferredSkills: qRegex },
        { location: qRegex },
        { industry: qRegex },
      ],
    });
  }

  if (locationRegex) {
    filters.push({ location: locationRegex });
  }

  if (skillsRegex) {
    filters.push({
      $or: [{ requiredSkills: skillsRegex }, { preferredSkills: skillsRegex }],
    });
  }

  if (workMode && workModeValues.includes(workMode)) {
    filters.push({ workMode });
  }

  if (employmentType && employmentTypeValues.includes(employmentType)) {
    filters.push({ employmentType });
  }

  if (audience && ["fresher", "experienced"].includes(audience)) {
    filters.push({ candidateAudience: { $in: ["all", audience] } });
  }

  return filters.length === 1 ? filters[0] : { $and: filters };
}

function buildCompanyJobFilter(query = {}, companyAccountId) {
  const filters = [{ companyAccountId: toObjectId(companyAccountId) }];
  const status = normalizeLookupKey(query.status);
  const qRegex = buildTextSearchRegex(query.q);

  if (status && jobStatusValues.includes(status)) {
    filters.push({ status });
  }

  if (qRegex) {
    filters.push({
      $or: [{ title: qRegex }, { department: qRegex }, { location: qRegex }, { jobReference: qRegex }],
    });
  }

  return filters.length === 1 ? filters[0] : { $and: filters };
}

function buildConsultancyJobFilter(query = {}) {
  const filters = [];
  const status = normalizeLookupKey(query.status);
  const qRegex = buildTextSearchRegex(query.q);
  const companyRegex = buildTextSearchRegex(query.company);

  if (status && jobStatusValues.includes(status)) {
    filters.push({ status });
  }

  if (qRegex) {
    filters.push({
      $or: [{ title: qRegex }, { department: qRegex }, { location: qRegex }, { jobReference: qRegex }],
    });
  }

  if (companyRegex) {
    filters.push({
      $or: [{ companyDisplayName: companyRegex }, { companyEmail: companyRegex }],
    });
  }

  return filters.length === 0 ? {} : filters.length === 1 ? filters[0] : { $and: filters };
}

function buildConsultancyApplicationFilter(query = {}) {
  const filters = [];
  const companyRegex = buildTextSearchRegex(query.company);
  const jobRegex = buildTextSearchRegex(query.job);
  const status = normalizeLookupKey(query.status);
  const candidateType = normalizeLookupKey(query.candidateType);
  const preferredRoleRegex = buildTextSearchRegex(query.preferredRole);
  const locationRegex = buildTextSearchRegex(query.location);
  const qRegex = buildTextSearchRegex(query.q);

  if (status && applicationStatusValues.includes(status)) {
    filters.push({ currentStatus: status });
  }

  if (candidateType && ["fresher", "experienced"].includes(candidateType)) {
    filters.push({ candidateType });
  }

  if (jobRegex) {
    filters.push({
      $or: [{ jobReference: jobRegex }, { "candidateProfileSnapshot.preferredRole": jobRegex }],
    });
  }

  if (preferredRoleRegex) {
    filters.push({ "candidateProfileSnapshot.preferredRole": preferredRoleRegex });
  }

  if (locationRegex) {
    filters.push({ "candidateProfileSnapshot.location": locationRegex });
  }

  if (qRegex) {
    filters.push({
      $or: [
        { applicationReference: qRegex },
        { jobReference: qRegex },
        { "candidateProfileSnapshot.skills": qRegex },
        { "candidateProfileSnapshot.preferredRole": qRegex },
        { "candidateProfileSnapshot.location": qRegex },
      ],
    });
  }

  return {
    mongoFilter:
      filters.length === 0 ? {} : filters.length === 1 ? filters[0] : { $and: filters },
    companyRegex,
  };
}

function isPublicJobActive(job) {
  if (!job) {
    return false;
  }

  if (!publicJobVisibleStatuses.has(String(job.currentStatus || "").trim().toLowerCase())) {
    return false;
  }

  const deadline = coerceDateValue(job.applicationDeadline);

  if (deadline && deadline.getTime() < toStartOfDay().getTime()) {
    return false;
  }

  return true;
}

function validateScreeningAnswers(questions = [], answers = []) {
  const normalizedQuestions = Array.isArray(questions) ? questions : [];
  const normalizedAnswers = Array.isArray(answers) ? answers : [];

  if (normalizedQuestions.length === 0) {
    return [];
  }

  const answerMap = new Map(
    normalizedAnswers.map((answer) => [String(answer.questionId || answer.id || ""), answer]),
  );

  const result = [];

  for (const question of normalizedQuestions) {
    const answer = answerMap.get(String(question.id || "")) || null;
    const answerText = normalizeTextValue(answer?.answer);

    if (!answerText) {
      return { error: `Answer the screening question: ${question.question}` };
    }

    result.push({
      questionId: question.id,
      question: question.question,
      answer: answerText,
    });
  }

  return result;
}

async function appendJobStatusHistory(store, payload) {
  await store.collections.jobStatusHistory.insertOne(buildJobStatusHistoryDocument(payload));
}

async function appendApplicationStatusHistory(store, payload) {
  await store.collections.applicationStatusHistory.insertOne(
    buildApplicationStatusHistoryDocument(payload),
  );
}

async function buildJobMetricsMap(store, jobIds = []) {
  const normalizedJobIds = jobIds.map(toObjectId).filter(Boolean);

  if (normalizedJobIds.length === 0) {
    return new Map();
  }

  const [interestCounts, applicationCounts, shareCounts] = await Promise.all([
    store.collections.candidateInterests
      .aggregate([
        { $match: { jobId: { $in: normalizedJobIds } } },
        { $group: { _id: "$jobId", count: { $sum: 1 } } },
      ])
      .toArray(),
    store.collections.applications
      .aggregate([
        { $match: { jobId: { $in: normalizedJobIds } } },
        {
          $group: {
            _id: { jobId: "$jobId", status: "$currentStatus" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    store.collections.anonymousProfileShares
      .aggregate([
        { $match: { jobId: { $in: normalizedJobIds } } },
        { $group: { _id: "$jobId", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const metricsMap = new Map(
    normalizedJobIds.map((jobId) => [
      String(jobId),
      {
        interestCount: 0,
        applicationCount: 0,
        underReviewCount: 0,
        shortlistedCount: 0,
        anonymousProfilesSharedCount: 0,
        interviewCount: 0,
        selectedCount: 0,
        joinedCount: 0,
      },
    ]),
  );

  for (const record of interestCounts) {
    const entry = metricsMap.get(String(record._id));

    if (entry) {
      entry.interestCount = Number(record.count || 0);
    }
  }

  const statusCountMap = new Map();

  for (const record of applicationCounts) {
    const jobKey = String(record._id?.jobId || "");
    const status = String(record._id?.status || "");

    if (!statusCountMap.has(jobKey)) {
      statusCountMap.set(jobKey, {});
    }

    statusCountMap.get(jobKey)[status] = Number(record.count || 0);
  }

  for (const [jobKey, statusCounts] of statusCountMap.entries()) {
    const entry = metricsMap.get(jobKey);

    if (!entry) {
      continue;
    }

    const summary = summarizeApplicationStatusCounts(statusCounts);
    entry.applicationCount = summary.totalApplications;
    entry.underReviewCount = summary.underReview;
    entry.shortlistedCount = summary.shortlisted;
    entry.interviewCount = summary.interviewCount;
    entry.selectedCount = summary.selectedCount;
    entry.joinedCount = summary.joinedCount;
  }

  for (const record of shareCounts) {
    const entry = metricsMap.get(String(record._id));

    if (entry) {
      entry.anonymousProfilesSharedCount = Number(record.count || 0);
    }
  }

  return metricsMap;
}

async function connectToDatabase() {
  if (databaseConnectPromise) {
    return databaseConnectPromise;
  }

  databaseConnectPromise = (async () => {
    if (!mongoUri) {
      throw new Error(
        "Missing MONGODB_URI. Create a .env file from .env.example and add your MongoDB Atlas connection string.",
      );
    }

    const nextClient = buildMongoClient(mongoUri);

    try {
      await nextClient.connect();

      const nextStores = {};

      await Promise.all(
        Object.entries(roleStorage).map(async ([role, storage]) => {
          const collection = nextClient
            .db(storage.databaseName)
            .collection(storage.collectionName);

          await collection.createIndex(
            { email: 1 },
            { unique: true, name: "uniq_email" },
          );

          nextStores[role] = {
            role,
            databaseName: storage.databaseName,
            collectionName: storage.collectionName,
            collection,
          };
        }),
      );

      const nextRecruitmentStore = buildRecruitmentStore(nextClient);
      await initializeRecruitmentIndexes(nextRecruitmentStore);

      if (mongoClient && mongoClient !== nextClient) {
        await mongoClient.close().catch(() => {});
      }

      clearCredentialStores();
      clearRecruitmentStore();
      Object.assign(credentialStores, nextStores);
      recruitmentStore = nextRecruitmentStore;
      mongoClient = nextClient;
      databaseLastVerifiedAt = Date.now();
      databaseErrorMessage = "";
      databasePublicMessage = "Database connection is ready.";
    } catch (error) {
      databaseLastVerifiedAt = 0;
      clearCredentialStores();
      clearRecruitmentStore();
      await closeMongoClientQuietly(nextClient);
      throw error;
    }
  })().finally(() => {
    databaseConnectPromise = null;
  });

  return databaseConnectPromise;
}

async function connectCandidateDetailsStore() {
  if (candidateDetailsConnectPromise) {
    return candidateDetailsConnectPromise;
  }

  candidateDetailsConnectPromise = (async () => {
    if (!candidateDetailsMongoUri) {
      throw new Error("Missing MONGODB_CANDIDATE_DETAILS_URI for candidate details storage.");
    }

    const nextClient = buildMongoClient(candidateDetailsMongoUri);

    try {
      await nextClient.connect();

      const collection = nextClient
        .db(candidateDetailsStorage.databaseName)
        .collection(candidateDetailsStorage.collectionName);

      await collection.createIndex(
        { email: 1 },
        { unique: true, name: "uniq_candidate_profile_email" },
      );

      if (candidateDetailsClient && candidateDetailsClient !== nextClient) {
        await candidateDetailsClient.close().catch(() => {});
      }

      candidateDetailsClient = nextClient;
      candidateDetailsStore = {
        databaseName: candidateDetailsStorage.databaseName,
        collectionName: candidateDetailsStorage.collectionName,
        uriSource: candidateDetailsStorage.uriSource,
        usesPrimaryConnection: candidateDetailsStorage.usesPrimaryConnection,
        collection,
      };
      candidateDetailsLastVerifiedAt = Date.now();
      candidateDetailsErrorMessage = "";
      candidateDetailsPublicMessage = "Candidate details storage is ready.";
    } catch (error) {
      candidateDetailsLastVerifiedAt = 0;
      clearCandidateDetailsStore();
      await closeMongoClientQuietly(nextClient);
      throw error;
    }
  })().finally(() => {
    candidateDetailsConnectPromise = null;
  });

  return candidateDetailsConnectPromise;
}

function scheduleDatabaseReconnect() {
  if (databaseRetryTimer || isDatabaseReady()) {
    return;
  }

  databaseRetryTimer = setTimeout(async () => {
    databaseRetryTimer = null;

    try {
      await connectToDatabase();
      console.log("MongoDB connection is ready.");
    } catch (error) {
      databaseErrorMessage = error.message;
      databasePublicMessage = formatDatabasePublicMessage(error);
      console.warn("MongoDB connection retry failed:", error.message);
      scheduleDatabaseReconnect();
    }
  }, databaseRetryDelayMs);
}

async function initializeDatabaseConnection() {
  try {
    await connectToDatabase();
    console.log("MongoDB connection is ready.");
  } catch (error) {
    databaseErrorMessage = error.message;
    databasePublicMessage = formatDatabasePublicMessage(error);
    console.warn("MongoDB connection not ready:", error.message);
    scheduleDatabaseReconnect();
  }
}

function scheduleCandidateDetailsReconnect() {
  if (candidateDetailsRetryTimer || isCandidateDetailsReady()) {
    return;
  }

  candidateDetailsRetryTimer = setTimeout(async () => {
    candidateDetailsRetryTimer = null;

    try {
      await connectCandidateDetailsStore();
      console.log("Candidate details storage is ready.");
    } catch (error) {
      candidateDetailsErrorMessage = error.message;
      candidateDetailsPublicMessage = formatCandidateDetailsPublicMessage(error);
      console.warn("Candidate details storage retry failed:", error.message);
      scheduleCandidateDetailsReconnect();
    }
  }, databaseRetryDelayMs);
}

async function initializeCandidateDetailsConnection() {
  try {
    await connectCandidateDetailsStore();
    console.log("Candidate details storage is ready.");
  } catch (error) {
    candidateDetailsErrorMessage = error.message;
    candidateDetailsPublicMessage = formatCandidateDetailsPublicMessage(error);
    console.warn("Candidate details storage not ready:", error.message);
    scheduleCandidateDetailsReconnect();
  }
}

async function ensureDatabaseConnection() {
  if (isDatabaseReady()) {
    if (isRecentConnectionVerification(databaseLastVerifiedAt)) {
      return true;
    }

    try {
      await pingMongoConnection(mongoClient);
      databaseLastVerifiedAt = Date.now();
      databaseErrorMessage = "";
      databasePublicMessage = "Database connection is ready.";
      return true;
    } catch (error) {
      databaseErrorMessage = error.message;
      databasePublicMessage = formatDatabasePublicMessage(error);
      await resetPrimaryDatabaseConnection();
    }
  }

  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    databaseErrorMessage = error.message;
    databasePublicMessage = formatDatabasePublicMessage(error);
    scheduleDatabaseReconnect();
    return false;
  }
}

async function ensureCandidateDetailsConnection() {
  if (isCandidateDetailsReady()) {
    if (isRecentConnectionVerification(candidateDetailsLastVerifiedAt)) {
      return true;
    }

    try {
      await pingMongoConnection(candidateDetailsClient);
      candidateDetailsLastVerifiedAt = Date.now();
      candidateDetailsErrorMessage = "";
      candidateDetailsPublicMessage = "Candidate details storage is ready.";
      return true;
    } catch (error) {
      candidateDetailsErrorMessage = error.message;
      candidateDetailsPublicMessage = formatCandidateDetailsPublicMessage(error);
      await resetCandidateDetailsConnection();
    }
  }

  try {
    await connectCandidateDetailsStore();
    return true;
  } catch (error) {
    candidateDetailsErrorMessage = error.message;
    candidateDetailsPublicMessage = formatCandidateDetailsPublicMessage(error);
    scheduleCandidateDetailsReconnect();
    return false;
  }
}

function getPublishedFilePath(...segments) {
  return path.join(publicDir, ...segments);
}

function hasPublishedAssets() {
  return existsSync(getPublishedFilePath("index.html"));
}

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.use((req, res, next) => {
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin, req)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    },
    credentials: true,
  })(req, res, next);
});
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// Vercel serves public/** directly from the CDN. We keep local static serving
// for npm start so the same URLs work during local verification.
if (hasPublishedAssets()) {
  app.use(express.static(publicDir));
}

app.get("/api/health", async (_req, res) => {
  await Promise.allSettled([ensureDatabaseConnection(), ensureCandidateDetailsConnection()]);

  res.json({
    ok: true,
    databaseReady: isDatabaseReady(),
    recruitmentReady: isRecruitmentReady(),
    candidateDetailsReady: isCandidateDetailsReady(),
    mailConfigured: isMailConfigured(),
    mailSender: smtpFrom || null,
    databaseMessage: isDatabaseReady()
      ? "Database connection is ready."
      : getDatabaseUnavailableMessage(),
    databaseDebugMessage: databaseErrorMessage || null,
    candidateDetailsMessage: isCandidateDetailsReady()
      ? "Candidate details storage is ready."
      : getCandidateDetailsUnavailableMessage(),
    candidateDetailsDebugMessage: candidateDetailsErrorMessage || null,
    storage: Object.fromEntries(
      Object.entries(roleStorage).map(([role, storage]) => [role, storage.databaseName]),
    ),
    recruitmentStorage: {
      databaseName: recruitmentDbName,
      collections: recruitmentCollections,
    },
    candidateDetailsStorage,
    candidateDetailsConfiguration: {
      requiresDedicatedUri: true,
      uriSource: candidateDetailsUriSource,
      usesPrimaryConnection: candidateDetailsUsesPrimaryConnection,
    },
  });
});

app.get("/api/auth/session", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, null);

  if (!authContext) {
    return;
  }

  return res.json({
    ok: true,
    credential: sanitizeCredential(authContext.credential),
    session: {
      expiresAt: authContext.session.expiresAt,
      lastSeenAt: authContext.session.lastSeenAt || null,
    },
  });
});

// The browser calls this periodically while a user is actively working so the
// inactivity limit reflects real interaction, not just data-changing requests.
app.post("/api/auth/session/touch", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, null);

  if (!authContext) {
    return;
  }

  return res.json({ ok: true, lastSeenAt: new Date().toISOString() });
});

app.post("/api/auth/logout", async (req, res) => {
  await destroyAuthSession(req, res);

  return res.json({
    ok: true,
    message: "Signed out successfully.",
  });
});

app.get("/api/candidate/account", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");
  if (!authContext) return;

  const detailsStore = getCandidateDetailsStore();
  const profile = detailsStore
    ? await detailsStore.collection.findOne({ email: authContext.credential.email })
    : null;

  return res.json({
    ok: true,
    account: {
      name: authContext.credential.name || "",
      email: authContext.credential.email,
      createdAt: authContext.credential.createdAt || null,
      lastPasswordUpdatedAt: authContext.credential.lastPasswordUpdatedAt || authContext.credential.lastPasswordResetAt || null,
      consent: authContext.credential.consent === true,
      candidateType: profile?.candidateType || null,
      profileStatus: profile ? getCandidateProfileVisibility(profile).profileStatus : "not_created",
      profileUpdatedAt: profile?.updatedAt || null,
    },
  });
});

app.patch("/api/candidate/account/password", async (req, res) => {
  if (!enforceSensitiveRateLimit(req, "candidate-change-password", 8, 15 * 60 * 1000)) {
    return res.status(429).json({ ok: false, message: "Too many password-change attempts. Please wait and try again." });
  }
  const authContext = await requireAuthenticatedRole(req, res, "candidate");
  if (!authContext) return;

  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");
  const confirmPassword = String(req.body?.confirmPassword || "");
  if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ ok: false, message: "Enter your current password, new password, and confirmation." });
  if (newPassword.length < 8) return res.status(400).json({ ok: false, message: "New password must be at least 8 characters long." });
  if (newPassword !== confirmPassword) return res.status(400).json({ ok: false, message: "New password confirmation does not match." });
  if (currentPassword === newPassword) return res.status(400).json({ ok: false, message: "Choose a new password that differs from your current password." });
  if (!(await bcrypt.compare(currentPassword, authContext.credential.passwordHash))) return res.status(401).json({ ok: false, message: "Current password is incorrect." });

  const now = new Date();
  const candidateStore = getCandidateStore();
  const recruitment = getRecruitmentStore();
  await candidateStore.collection.updateOne(
    { _id: authContext.credential._id },
    { $set: { passwordHash: await bcrypt.hash(newPassword, saltRounds), lastPasswordUpdatedAt: now, updatedAt: now } },
  );
  if (recruitment) await recruitment.collections.sessions.deleteMany({ credentialId: authContext.credential._id, role: "candidate" });
  clearCookie(res, sessionCookieName);
  return res.json({ ok: true, message: "Password changed successfully. Please log in again on all devices." });
});

app.get("/api/company/dashboard", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const detailsStore = getCandidateDetailsStore();

  return res.json({
    ok: true,
    totalCandidates: await getCandidateCount(),
    syncedAt: new Date().toISOString(),
    storage: {
      databaseName: detailsStore.databaseName,
      collectionName: detailsStore.collectionName,
    },
  });
});

app.get("/api/company/dashboard/stream", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  res.write("retry: 5000\n\n");

  companyDashboardClients.add(res);

  const keepAliveTimer = setInterval(() => {
    if (!res.writableEnded) {
      res.write(": keepalive\n\n");
    }
  }, 25000);

  try {
    await writeCompanyDashboardSnapshot(res);
  } catch (error) {
    clearInterval(keepAliveTimer);
    companyDashboardClients.delete(res);
    console.warn("Unable to send initial company dashboard update:", error.message);
    return res.end();
  }

  req.on("close", () => {
    clearInterval(keepAliveTimer);
    companyDashboardClients.delete(res);

    if (!res.writableEnded) {
      res.end();
    }
  });
});

app.get("/api/consultancy/dashboard", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const detailsStore = getCandidateDetailsStore();
  const filterState = buildConsultancyCandidateFilter(req.query);
  const totalCandidates = await getCandidateCount();
  const filteredCandidates = await detailsStore.collection.countDocuments(filterState.mongoFilter);
  const profiles = await detailsStore.collection
    .find(filterState.mongoFilter)
    .sort({ updatedAt: -1, submittedAt: -1, createdAt: -1 })
    .limit(100)
    .toArray();

  return res.json({
    ok: true,
    totalCandidates,
    filteredCandidates,
    syncedAt: new Date().toISOString(),
    filters: {
      q: filterState.q,
      candidateType: filterState.candidateType,
      preferredRole: filterState.preferredRole,
      location: filterState.location,
    },
    candidates: profiles.map(sanitizeCandidateProfile),
    storage: {
      databaseName: detailsStore.databaseName,
      collectionName: detailsStore.collectionName,
    },
  });
});

app.get("/api/consultancy/companies", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const companyStore = getRoleStore("company");

  if (!companyStore) {
    return res.status(503).json({
      ok: false,
      message: "Company login storage is not ready yet.",
    });
  }

  const filterState = buildConsultancyCompanyFilter(req.query);
  const totalCompanies = await companyStore.collection.countDocuments({});
  const filteredCompanies = await companyStore.collection.countDocuments(filterState.mongoFilter);
  const companiesWithLoginActivity = await companyStore.collection.countDocuments({
    lastLoginAt: { $type: "date" },
  });
  const companies = await companyStore.collection
    .find(filterState.mongoFilter)
    .sort({ lastLoginAt: -1, updatedAt: -1, createdAt: -1 })
    .limit(100)
    .toArray();

  return res.json({
    ok: true,
    totalCompanies,
    filteredCompanies,
    companiesWithLoginActivity,
    syncedAt: new Date().toISOString(),
    filters: {
      q: filterState.q,
      loginActivity: filterState.loginActivity,
    },
    companies: companies.map(sanitizeConsultancyCompanyCredential),
    storage: {
      databaseName: companyStore.databaseName,
      collectionName: companyStore.collectionName,
    },
  });
});

app.get("/api/notifications", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, null);

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const recipientFilter = buildNotificationRecipientFilter(authContext);
  const [notifications, unreadCount, totalCount] = await Promise.all([
    store.collections.notifications
      .find(recipientFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray(),
    store.collections.notifications.countDocuments({
      ...recipientFilter,
      readAt: null,
    }),
    store.collections.notifications.countDocuments(recipientFilter),
  ]);

  return res.json({
    ok: true,
    unreadCount,
    totalCount,
    notifications: notifications.map(serializeNotificationView),
  });
});

app.patch("/api/notifications/:notificationId/read", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, null);

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const notificationId = toObjectId(req.params.notificationId);

  if (!notificationId) {
    return res.status(400).json({
      ok: false,
      message: "Choose a valid notification reference.",
    });
  }

  const recipientFilter = buildNotificationRecipientFilter(authContext);
  const now = new Date();
  const updateResult = await store.collections.notifications.updateOne(
    {
      _id: notificationId,
      ...recipientFilter,
      readAt: null,
    },
    {
      $set: {
        readAt: now,
        updatedAt: now,
      },
    },
  );

  if (updateResult.matchedCount === 0) {
    return res.status(404).json({
      ok: false,
      message: "Notification not found or already marked as read.",
    });
  }

  return res.json({
    ok: true,
    message: "Notification marked as read.",
  });
});

app.post("/api/notifications/read-all", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, null);

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const recipientFilter = buildNotificationRecipientFilter(authContext);
  const now = new Date();
  const updateResult = await store.collections.notifications.updateMany(
    {
      ...recipientFilter,
      readAt: null,
    },
    {
      $set: {
        readAt: now,
        updatedAt: now,
      },
    },
  );

  return res.json({
    ok: true,
    updatedCount: updateResult.modifiedCount || 0,
    message:
      updateResult.modifiedCount > 0
        ? "All available notifications were marked as read."
        : "There were no unread notifications to update.",
  });
});

app.post("/api/company/jobs", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const intent = normalizeLookupKey(req.body.intent || req.body.status || "draft");
  const shouldSubmit = intent === "submit" || intent === "submitted";
  const validation = validateJobPayload(req.body, { requireComplete: shouldSubmit });

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const sequenceNumber = await getNextSequenceValue(store.collections.counters, "jobReference");
  const jobReference = createPublicReference("JOB", sequenceNumber);
  const now = new Date();
  const companyDisplayName = formatAccountDisplayName(
    authContext.credential.name,
    authContext.credential.email,
    "Company Account",
  );
  const jobBody = buildInternalJobDocument(validation, authContext.credential);
  const identityRiskDetected = containsEmployerIdentitySignals(
    [
      jobBody.title,
      jobBody.description,
      ...jobBody.responsibilities,
      jobBody.additionalInformation,
    ].join("\n"),
    [companyDisplayName, authContext.credential.email, authContext.credential.name],
  );
  const initialStatus = shouldSubmit ? "submitted" : "draft";

  const jobDocument = {
    ...jobBody,
    jobReference,
    status: initialStatus,
    reviewComments: "",
    consultancyNotes: "",
    identityRiskDetected,
    submittedAt: shouldSubmit ? now : null,
    approvedAt: null,
    publishedAt: null,
    closedAt: null,
    archivedAt: null,
    closureRequestedAt: null,
    closureRequestReason: null,
  };

  const insertResult = await store.collections.jobs.insertOne(jobDocument);
  const createdJob = await store.collections.jobs.findOne({ _id: insertResult.insertedId });

  await appendJobStatusHistory(store, {
    jobId: insertResult.insertedId,
    jobReference,
    previousStatus: null,
    nextStatus: initialStatus,
    actorRole: "company",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: shouldSubmit ? "Job submitted to consultancy for review." : "Job saved as draft.",
  });
  await writeActivityLog(store, {
    actorRole: "company",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    entityType: "job",
    entityReference: jobReference,
    action: shouldSubmit ? "company_job_created_and_submitted" : "company_job_created_draft",
    details: {
      status: initialStatus,
    },
  });

  if (shouldSubmit) {
    await createNotification(store, {
      recipientRole: "consultancy",
      recipientAccountId: null,
      type: "job_submitted",
      title: "New job submitted for review",
      message: `${companyDisplayName} submitted ${jobReference} for consultancy review.`,
      entityType: "job",
      entityReference: jobReference,
    });
  } else {
    await createNotification(store, {
      recipientRole: "company",
      recipientAccountId: authContext.credential._id,
      recipientEmail: authContext.credential.email,
      type: "job_saved_draft",
      title: "Job saved as draft",
      message: `${jobReference} has been saved as a draft and can be edited before submission.`,
      entityType: "job",
      entityReference: jobReference,
    });
  }

  return res.status(201).json({
    ok: true,
    message: shouldSubmit
      ? "Job created and submitted to consultancy successfully."
      : "Job draft created successfully.",
    job: buildCompanyJobView(createdJob),
  });
});

app.get("/api/company/jobs", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const filter = buildCompanyJobFilter(req.query, authContext.credential._id);
  const jobs = await store.collections.jobs
    .find(filter)
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(100)
    .toArray();
  const metricsMap = await buildJobMetricsMap(
    store,
    jobs.map((job) => job._id),
  );
  const notifications = await store.collections.notifications
    .find(buildNotificationRecipientFilter(authContext, { includeGlobal: false }))
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();

  const jobViews = jobs.map((job) => buildCompanyJobView(job, metricsMap.get(String(job._id))));
  const summary = jobViews.reduce(
    (totals, job) => {
      if (job.status === "published") {
        totals.activeJobs += 1;
      }

      if (["submitted", "under_consultancy_review", "approved"].includes(job.status)) {
        totals.pendingJobs += 1;
      }

      if (job.status === "changes_requested") {
        totals.jobsRequiringChanges += 1;
      }

      totals.totalCandidateInterests += Number(job.metrics.interestCount || 0);
      totals.totalApplications += Number(job.metrics.applicationCount || 0);
      totals.underConsultancyReview += Number(job.metrics.underReviewCount || 0);
      totals.shortlisted += Number(job.metrics.shortlistedCount || 0);
      totals.interviewStage += Number(job.metrics.interviewCount || 0);
      totals.selected += Number(job.metrics.selectedCount || 0);
      totals.joined += Number(job.metrics.joinedCount || 0);
      return totals;
    },
    {
      activeJobs: 0,
      pendingJobs: 0,
      jobsRequiringChanges: 0,
      totalCandidateInterests: 0,
      totalApplications: 0,
      underConsultancyReview: 0,
      shortlisted: 0,
      interviewStage: 0,
      selected: 0,
      joined: 0,
    },
  );

  return res.json({
    ok: true,
    summary,
    jobs: jobViews,
    recentUpdates: notifications.map(serializeNotificationView),
  });
});

app.get("/api/company/jobs/:jobReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({
    jobReference,
    companyAccountId: authContext.credential._id,
  });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found for this company account.",
    });
  }

  const metricsMap = await buildJobMetricsMap(store, [job._id]);

  return res.json({
    ok: true,
    job: {
      ...buildCompanyJobView(job, metricsMap.get(String(job._id))),
      description: job.description,
      responsibilities: job.responsibilities || [],
      requiredSkills: job.requiredSkills || [],
      preferredSkills: job.preferredSkills || [],
      qualification: job.qualification || "",
      minimumExperience: job.minimumExperience ?? null,
      maximumExperience: job.maximumExperience ?? null,
      salaryMinimum: job.salaryMinimum ?? null,
      salaryMaximum: job.salaryMaximum ?? null,
      showSalaryToCandidate: job.showSalaryToCandidate === true,
      shiftDetails: job.shiftDetails || "",
      noticePeriodPreference: job.noticePeriodPreference || "",
      screeningQuestions: job.screeningQuestions || [],
      candidateAudience: job.candidateAudience || "all",
      industry: job.industry || "",
      additionalInformation: job.additionalInformation || "",
      internalCompanyNote: job.internalCompanyNote || "",
    },
  });
});

app.put("/api/company/jobs/:jobReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const existingJob = await store.collections.jobs.findOne({
    jobReference,
    companyAccountId: authContext.credential._id,
  });

  if (!existingJob) {
    return res.status(404).json({
      ok: false,
      message: "Job not found for this company account.",
    });
  }

  if (!companyEditableJobStatuses.has(existingJob.status)) {
    return res.status(409).json({
      ok: false,
      message: "Only draft or changes-requested jobs can be edited by the company.",
    });
  }

  const validation = validateJobPayload(req.body, { requireComplete: false });

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const jobBody = buildInternalJobDocument(validation, authContext.credential, existingJob);
  const companyDisplayName = formatAccountDisplayName(
    authContext.credential.name,
    authContext.credential.email,
    "Company Account",
  );
  const identityRiskDetected = containsEmployerIdentitySignals(
    [
      jobBody.title,
      jobBody.description,
      ...jobBody.responsibilities,
      jobBody.additionalInformation,
    ].join("\n"),
    [companyDisplayName, authContext.credential.email, authContext.credential.name],
  );

  await store.collections.jobs.updateOne(
    { _id: existingJob._id },
    {
      $set: {
        ...jobBody,
        identityRiskDetected,
      },
    },
  );

  const updatedJob = await store.collections.jobs.findOne({ _id: existingJob._id });
  const metricsMap = await buildJobMetricsMap(store, [existingJob._id]);

  await writeActivityLog(store, {
    actorRole: "company",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    entityType: "job",
    entityReference: jobReference,
    action: "company_job_updated",
    details: {
      status: existingJob.status,
    },
  });

  return res.json({
    ok: true,
    message: "Job updated successfully.",
    job: buildCompanyJobView(updatedJob, metricsMap.get(String(existingJob._id))),
  });
});

app.post("/api/company/jobs/:jobReference/submit", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({
    jobReference,
    companyAccountId: authContext.credential._id,
  });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found for this company account.",
    });
  }

  if (!companySubmittableJobStatuses.has(job.status)) {
    return res.status(409).json({
      ok: false,
      message: "Only draft or changes-requested jobs can be submitted.",
    });
  }

  const completeValidation = validateJobPayload(toJobValidationPayload(job), {
    requireComplete: true,
  });

  if (completeValidation.error) {
    return res.status(400).json({
      ok: false,
      message: completeValidation.error,
    });
  }

  const companyDisplayName = formatAccountDisplayName(
    authContext.credential.name,
    authContext.credential.email,
    "Company Account",
  );
  const now = new Date();
  const identityRiskDetected = containsEmployerIdentitySignals(
    [job.title, job.description, ...(job.responsibilities || []), job.additionalInformation].join(
      "\n",
    ),
    [companyDisplayName, authContext.credential.email, authContext.credential.name],
  );

  await store.collections.jobs.updateOne(
    { _id: job._id },
    {
      $set: {
        status: "submitted",
        reviewComments: "",
        submittedAt: now,
        updatedAt: now,
        identityRiskDetected,
      },
    },
  );

  await appendJobStatusHistory(store, {
    jobId: job._id,
    jobReference,
    previousStatus: job.status,
    nextStatus: "submitted",
    actorRole: "company",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: "Job submitted to consultancy for review.",
  });
  await createNotification(store, {
    recipientRole: "consultancy",
    recipientAccountId: null,
    type: "job_submitted",
    title: "New job submitted for review",
    message: `${companyDisplayName} submitted ${jobReference} for consultancy review.`,
    entityType: "job",
    entityReference: jobReference,
  });

  const updatedJob = await store.collections.jobs.findOne({ _id: job._id });
  const metricsMap = await buildJobMetricsMap(store, [job._id]);

  return res.json({
    ok: true,
    message: "Job submitted to consultancy successfully.",
    job: buildCompanyJobView(updatedJob, metricsMap.get(String(job._id))),
  });
});

app.patch("/api/company/jobs/:jobReference/close-request", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({
    jobReference,
    companyAccountId: authContext.credential._id,
  });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found for this company account.",
    });
  }

  const reason = sanitizeOptionalText(req.body.reason || req.body.closureRequestReason);
  const now = new Date();

  await store.collections.jobs.updateOne(
    { _id: job._id },
    {
      $set: {
        closureRequestedAt: now,
        closureRequestReason: reason,
        updatedAt: now,
      },
    },
  );
  await createNotification(store, {
    recipientRole: "consultancy",
    recipientAccountId: null,
    type: "job_close_requested",
    title: "Company requested job closure",
    message: `${jobReference} has a closure request from the company.`,
    entityType: "job",
    entityReference: jobReference,
  });

  return res.json({
    ok: true,
    message: "Job closure request sent to consultancy successfully.",
  });
});

app.get("/api/company/jobs/:jobReference/metrics", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({
    jobReference,
    companyAccountId: authContext.credential._id,
  });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found for this company account.",
    });
  }

  const metricsMap = await buildJobMetricsMap(store, [job._id]);

  return res.json({
    ok: true,
    metrics: metricsMap.get(String(job._id)) || buildCompanyJobView(job).metrics,
  });
});

app.get("/api/company/jobs/:jobReference/anonymous-candidates", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({
    jobReference,
    companyAccountId: authContext.credential._id,
  });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found for this company account.",
    });
  }

  const shares = await store.collections.anonymousProfileShares
    .find({
      companyAccountId: authContext.credential._id,
      jobId: job._id,
    })
    .sort({ sharedAt: -1, createdAt: -1 })
    .toArray();
  const anonymousIds = shares.map((share) => toObjectId(share.anonymousCandidateProfileId)).filter(Boolean);
  const applicationIds = shares.map((share) => toObjectId(share.applicationId)).filter(Boolean);
  const [anonymousProfiles, applications] = await Promise.all([
    anonymousIds.length > 0
      ? store.collections.anonymousCandidateProfiles
          .find({ _id: { $in: anonymousIds } })
          .toArray()
      : [],
    applicationIds.length > 0
      ? store.collections.applications.find({ _id: { $in: applicationIds } }).toArray()
      : [],
  ]);
  const anonymousProfileMap = new Map(
    anonymousProfiles.map((profile) => [String(profile._id), profile]),
  );
  const applicationMap = new Map(applications.map((application) => [String(application._id), application]));

  return res.json({
    ok: true,
    candidates: shares.map((share) =>
      buildCompanyAnonymousCandidateView(
        share,
        anonymousProfileMap.get(String(share.anonymousCandidateProfileId)),
        applicationMap.get(String(share.applicationId)),
      ),
    ),
  });
});

app.post("/api/company/applications/:applicationReference/decision", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "company");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.params.applicationReference);
  const action = normalizeLookupKey(req.body.action);

  if (!companyDecisionActions.includes(action)) {
    return res.status(400).json({
      ok: false,
      message: "Choose a valid company decision action.",
    });
  }

  const application = await store.collections.applications.findOne({
    applicationReference,
    companyAccountId: authContext.credential._id,
  });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found for this company account.",
    });
  }

  const sharedProfile = await store.collections.anonymousProfileShares.findOne({
    applicationId: application._id,
    companyAccountId: authContext.credential._id,
  });

  if (!sharedProfile) {
    return res.status(403).json({
      ok: false,
      message: "This application has not been shared with the company as an anonymous profile yet.",
    });
  }

  const nextStatusByAction = {
    request_interview: "company_selected_for_interview",
    reject_candidate: "company_rejected",
    request_more_information: "additional_information_required",
    put_on_hold: "on_hold",
  };
  const nextStatus = nextStatusByAction[action];
  const note = sanitizeOptionalText(req.body.note);
  const now = new Date();

  await store.collections.applications.updateOne(
    { _id: application._id },
    {
      $set: {
        currentStatus: nextStatus,
        companyLastDecisionAction: action,
        companyDecisionNote: note,
        updatedAt: now,
      },
    },
  );
  await appendApplicationStatusHistory(store, {
    applicationId: application._id,
    applicationReference,
    previousStatus: application.currentStatus,
    nextStatus,
    actorRole: "company",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note:
      note ||
      `Company action recorded: ${action.replace(/_/g, " ")}.`,
  });
  await createNotification(store, {
    recipientRole: "consultancy",
    recipientAccountId: null,
    type: "company_action_required",
    title: "Company decision recorded",
    message: `${applicationReference} has a new company action: ${action.replace(/_/g, " ")}.`,
    entityType: "application",
    entityReference: applicationReference,
  });

  return res.json({
    ok: true,
    message: "Company decision recorded and sent to consultancy successfully.",
  });
});

app.get("/api/candidate/jobs", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  let profile = null;

  if (await ensureCandidateDetailsConnection()) {
    profile = await getCandidateDetailsStore().collection.findOne({
      email: authContext.credential.email,
    });
  }

  const filter = buildCandidateJobFilter(req.query, profile?.candidateType || "");
  const jobs = await store.collections.jobPublicViews
    .find(filter)
    .sort({ publishedAt: -1, updatedAt: -1 })
    .limit(100)
    .toArray();
  const jobIds = jobs.map((job) => toObjectId(job.jobId)).filter(Boolean);
  const candidateMatch = profile
    ? {
        $or: [
          { candidateLoginId: authContext.credential._id },
          { candidateProfileId: profile._id },
        ],
      }
    : { candidateLoginId: authContext.credential._id };
  const [interests, applications] = await Promise.all([
    jobIds.length > 0
      ? store.collections.candidateInterests
          .find({
            jobId: { $in: jobIds },
            ...candidateMatch,
          })
          .toArray()
      : [],
    jobIds.length > 0
      ? store.collections.applications
          .find({
            jobId: { $in: jobIds },
            ...candidateMatch,
          })
          .toArray()
      : [],
  ]);
  const interestJobIds = new Set(interests.map((item) => String(item.jobId)));
  const applicationMap = new Map(applications.map((item) => [String(item.jobId), item]));

  return res.json({
    ok: true,
    jobs: jobs.map((job) =>
      buildCandidateJobView(job, {
        isInterestRegistered: interestJobIds.has(String(job.jobId)),
        isApplied: applicationMap.has(String(job.jobId)),
        applicationReference: applicationMap.get(String(job.jobId))?.applicationReference || null,
      }),
    ),
  });
});

app.get("/api/candidate/jobs/:jobReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  let profile = null;

  if (await ensureCandidateDetailsConnection()) {
    profile = await getCandidateDetailsStore().collection.findOne({
      email: authContext.credential.email,
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobPublicViews.findOne({ jobReference });

  if (!job || !isPublicJobActive(job)) {
    return res.status(404).json({
      ok: false,
      message: "This job is not available right now.",
    });
  }

  const candidateMatch = profile
    ? {
        $or: [
          { candidateLoginId: authContext.credential._id },
          { candidateProfileId: profile._id },
        ],
      }
    : { candidateLoginId: authContext.credential._id };
  const [interest, application] = await Promise.all([
    store.collections.candidateInterests.findOne({
      jobId: toObjectId(job.jobId),
      ...candidateMatch,
    }),
    store.collections.applications.findOne({
      jobId: toObjectId(job.jobId),
      ...candidateMatch,
    }),
  ]);

  return res.json({
    ok: true,
    job: buildCandidateJobView(job, {
      isInterestRegistered: Boolean(interest),
      isApplied: Boolean(application),
      applicationReference: application?.applicationReference || null,
    }),
  });
});

app.post("/api/candidate/jobs/:jobReference/interest", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const detailsStore = getCandidateDetailsStore();
  const profile = await detailsStore.collection.findOne({
    email: authContext.credential.email,
  });
  const accessCheck = validateCandidateAccessForRecruitment(authContext.credential, profile);

  if (accessCheck.error) {
    return res.status(403).json({
      ok: false,
      message: accessCheck.error,
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const [publicJob, internalJob] = await Promise.all([
    store.collections.jobPublicViews.findOne({ jobReference }),
    store.collections.jobs.findOne({ jobReference }),
  ]);

  if (!publicJob || !internalJob || !isPublicJobActive(publicJob)) {
    return res.status(404).json({
      ok: false,
      message: "This job is not available for interest right now.",
    });
  }

  const existingInterest = await store.collections.candidateInterests.findOne({
    jobId: internalJob._id,
    candidateProfileId: profile._id,
  });

  if (existingInterest) {
    return res.status(409).json({
      ok: false,
      message: "Interest has already been registered for this job.",
    });
  }

  const sequenceNumber = await getNextSequenceValue(
    store.collections.counters,
    "interestReference",
  );
  const interestReference = createPublicReference("INT", sequenceNumber);
  const now = new Date();

  await store.collections.candidateInterests.insertOne({
    interestReference,
    jobId: internalJob._id,
    jobReference,
    companyAccountId: internalJob.companyAccountId,
    candidateLoginId: authContext.credential._id,
    candidateProfileId: profile._id,
    candidateType: profile.candidateType,
    preferredRole: profile.preferredRole,
    location: profile.location,
    currentStatus: "interest_registered",
    candidateDeleted: false,
    createdAt: now,
    updatedAt: now,
  });
  await createNotification(store, {
    recipientRole: "consultancy",
    recipientAccountId: null,
    type: "candidate_interest",
    title: "New candidate interest",
    message: `${interestReference} was registered for ${jobReference}.`,
    entityType: "interest",
    entityReference: interestReference,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: internalJob.companyAccountId,
    recipientEmail: internalJob.companyEmail || "",
    type: "new_interest_received",
    title: "New anonymous interest received",
    message: `${jobReference} has a new candidate interest update from the consultancy pipeline.`,
    entityType: "job",
    entityReference: jobReference,
  });
  await createNotification(store, {
    recipientRole: "candidate",
    recipientAccountId: authContext.credential._id,
    recipientEmail: authContext.credential.email,
    type: "interest_registered",
    title: "Interest registered",
    message: `Your interest has been registered for ${jobReference}.`,
    entityType: "interest",
    entityReference: interestReference,
  });

  return res.json({
    ok: true,
    message: "Interest registered successfully.",
    interestReference,
  });
});

app.post("/api/candidate/jobs/:jobReference/apply", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const detailsStore = getCandidateDetailsStore();
  const profile = await detailsStore.collection.findOne({
    email: authContext.credential.email,
  });
  const accessCheck = validateCandidateAccessForRecruitment(authContext.credential, profile);

  if (accessCheck.error) {
    return res.status(403).json({
      ok: false,
      message: accessCheck.error,
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const publicJob = await store.collections.jobPublicViews.findOne({ jobReference });

  if (!publicJob || !isPublicJobActive(publicJob)) {
    return res.status(404).json({
      ok: false,
      message: "This job is not available for application right now.",
    });
  }

  const internalJob = await store.collections.jobs.findOne({
    _id: toObjectId(publicJob.jobId),
  });

  if (!internalJob) {
    return res.status(404).json({
      ok: false,
      message: "Unable to find the internal job record for this application.",
    });
  }

  const existingApplication = await store.collections.applications.findOne({
    jobId: internalJob._id,
    candidateProfileId: profile._id,
  });

  if (existingApplication) {
    return res.status(409).json({
      ok: false,
      message: "You have already applied for this job.",
    });
  }

  const screeningAnswers = validateScreeningAnswers(
    publicJob.screeningQuestions || [],
    req.body.screeningAnswers || req.body.answers || [],
  );

  if (screeningAnswers.error) {
    return res.status(400).json({
      ok: false,
      message: screeningAnswers.error,
    });
  }

  const sequenceNumber = await getNextSequenceValue(
    store.collections.counters,
    "applicationReference",
  );
  const applicationReference = createPublicReference("APP", sequenceNumber);
  const now = new Date();

  const applicationInsertResult = await store.collections.applications.insertOne({
    applicationReference,
    jobId: internalJob._id,
    jobReference,
    companyAccountId: internalJob.companyAccountId,
    candidateLoginId: authContext.credential._id,
    candidateProfileId: profile._id,
    candidateType: profile.candidateType,
    candidateProfileSnapshot: buildCandidateProfileSnapshot(profile),
    screeningAnswers,
    currentStatus: "application_submitted",
    isWithdrawn: false,
    candidateDeleted: false,
    appliedAt: now,
    updatedAt: now,
  });
  await appendApplicationStatusHistory(store, {
    applicationId: applicationInsertResult.insertedId,
    applicationReference,
    previousStatus: null,
    nextStatus: "application_submitted",
    actorRole: "candidate",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: "Candidate submitted an application using the structured profile.",
  });
  await createNotification(store, {
    recipientRole: "consultancy",
    recipientAccountId: null,
    type: "candidate_application",
    title: "New candidate application",
    message: `${applicationReference} has been submitted for ${jobReference}.`,
    entityType: "application",
    entityReference: applicationReference,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: internalJob.companyAccountId,
    recipientEmail: internalJob.companyEmail || "",
    type: "new_application_received",
    title: "New anonymous application received",
    message: `${jobReference} has a new candidate application in the consultancy-managed pipeline.`,
    entityType: "job",
    entityReference: jobReference,
  });
  await createNotification(store, {
    recipientRole: "candidate",
    recipientAccountId: authContext.credential._id,
    recipientEmail: authContext.credential.email,
    type: "application_submitted",
    title: "Application submitted",
    message: `Your application has been submitted successfully for ${jobReference}.`,
    entityType: "application",
    entityReference: applicationReference,
  });

  const createdApplication = await store.collections.applications.findOne({
    _id: applicationInsertResult.insertedId,
  });

  return res.status(201).json({
    ok: true,
    message: "Application submitted successfully.",
    application: buildCandidateApplicationView(createdApplication, publicJob),
  });
});

app.get("/api/candidate/applications", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  let profile = null;

  if (await ensureCandidateDetailsConnection()) {
    profile = await getCandidateDetailsStore().collection.findOne({
      email: authContext.credential.email,
    });
  }

  const candidateMatch = profile
    ? {
        $or: [
          { candidateLoginId: authContext.credential._id },
          { candidateProfileId: profile._id },
        ],
      }
    : { candidateLoginId: authContext.credential._id };
  const applications = await store.collections.applications
    .find(candidateMatch)
    .sort({ appliedAt: -1, updatedAt: -1 })
    .limit(100)
    .toArray();
  const jobReferences = Array.from(
    new Set(applications.map((application) => application.jobReference).filter(Boolean)),
  );
  const jobs = jobReferences.length > 0
    ? await store.collections.jobPublicViews
        .find({ jobReference: { $in: jobReferences } })
        .toArray()
    : [];
  const jobMap = new Map(jobs.map((job) => [job.jobReference, job]));

  return res.json({
    ok: true,
    applications: applications.map((application) =>
      buildCandidateApplicationView(application, jobMap.get(application.jobReference)),
    ),
  });
});

app.get("/api/candidate/applications/:applicationReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  let profile = null;

  if (await ensureCandidateDetailsConnection()) {
    profile = await getCandidateDetailsStore().collection.findOne({
      email: authContext.credential.email,
    });
  }

  const candidateMatch = profile
    ? {
        $or: [
          { candidateLoginId: authContext.credential._id },
          { candidateProfileId: profile._id },
        ],
      }
    : { candidateLoginId: authContext.credential._id };
  const application = await store.collections.applications.findOne({
    applicationReference: normalizeTextValue(req.params.applicationReference),
    ...candidateMatch,
  });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found for this candidate account.",
    });
  }

  const job = await store.collections.jobPublicViews.findOne({
    jobReference: application.jobReference,
  });

  return res.json({
    ok: true,
    application: buildCandidateApplicationView(application, job),
  });
});

app.patch("/api/candidate/applications/:applicationReference/withdraw", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  let profile = null;

  if (await ensureCandidateDetailsConnection()) {
    profile = await getCandidateDetailsStore().collection.findOne({
      email: authContext.credential.email,
    });
  }

  const candidateMatch = profile
    ? {
        $or: [
          { candidateLoginId: authContext.credential._id },
          { candidateProfileId: profile._id },
        ],
      }
    : { candidateLoginId: authContext.credential._id };
  const application = await store.collections.applications.findOne({
    applicationReference: normalizeTextValue(req.params.applicationReference),
    ...candidateMatch,
  });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found for this candidate account.",
    });
  }

  const blockedStatuses = new Set([
    "consultancy_rejected",
    "company_rejected",
    "not_selected",
    "selected",
    "joined",
    "job_closed",
    "application_withdrawn",
  ]);

  if (blockedStatuses.has(application.currentStatus)) {
    return res.status(409).json({
      ok: false,
      message: "This application can no longer be withdrawn.",
    });
  }

  const now = new Date();

  await store.collections.applications.updateOne(
    { _id: application._id },
    {
      $set: {
        currentStatus: "application_withdrawn",
        isWithdrawn: true,
        withdrawnAt: now,
        updatedAt: now,
      },
    },
  );
  await appendApplicationStatusHistory(store, {
    applicationId: application._id,
    applicationReference: application.applicationReference,
    previousStatus: application.currentStatus,
    nextStatus: "application_withdrawn",
    actorRole: "candidate",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: "Candidate withdrew the application.",
  });
  await createNotification(store, {
    recipientRole: "consultancy",
    recipientAccountId: null,
    type: "candidate_withdrew_application",
    title: "Candidate withdrew an application",
    message: `${application.applicationReference} has been withdrawn by the candidate.`,
    entityType: "application",
    entityReference: application.applicationReference,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: application.companyAccountId,
    type: "application_withdrawn",
    title: "Anonymous application withdrawn",
    message: `${application.jobReference} has an anonymous application withdrawal update.`,
    entityType: "application",
    entityReference: application.applicationReference,
  });

  return res.json({
    ok: true,
    message: "Application withdrawn successfully.",
  });
});

app.get("/api/consultancy/jobs", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const filter = buildConsultancyJobFilter(req.query);
  const jobs = await store.collections.jobs
    .find(filter)
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(100)
    .toArray();
  const jobReferences = jobs.map((job) => job.jobReference);
  const publicViews = jobReferences.length > 0
    ? await store.collections.jobPublicViews.find({ jobReference: { $in: jobReferences } }).toArray()
    : [];
  const publicViewMap = new Map(publicViews.map((job) => [job.jobReference, job]));
  const metricsMap = await buildJobMetricsMap(
    store,
    jobs.map((job) => job._id),
  );
  const jobViews = jobs.map((job) =>
    buildConsultancyJobView(
      job,
      publicViewMap.get(job.jobReference),
      metricsMap.get(String(job._id)),
    ),
  );
  const summary = jobViews.reduce(
    (totals, job) => {
      if (["submitted", "under_consultancy_review"].includes(job.status)) {
        totals.jobsPendingApproval += 1;
      }

      if (job.status === "published") {
        totals.publishedJobs += 1;
      }

      totals.newInterests += Number(job.metrics.interestCount || 0);
      totals.newApplications += Number(job.metrics.applicationCount || 0);
      totals.pendingScreening += Number(job.metrics.underReviewCount || 0);
      totals.shortlistedCandidates += Number(job.metrics.shortlistedCount || 0);
      totals.interviewsInProgress += Number(job.metrics.interviewCount || 0);
      totals.selectedCandidates += Number(job.metrics.selectedCount || 0);
      totals.joinedCandidates += Number(job.metrics.joinedCount || 0);
      return totals;
    },
    {
      jobsPendingApproval: 0,
      publishedJobs: 0,
      newInterests: 0,
      newApplications: 0,
      pendingScreening: 0,
      shortlistedCandidates: 0,
      interviewsInProgress: 0,
      selectedCandidates: 0,
      joinedCandidates: 0,
    },
  );

  return res.json({
    ok: true,
    summary,
    jobs: jobViews,
  });
});

app.get("/api/consultancy/jobs/:jobReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const [job, publicView] = await Promise.all([
    store.collections.jobs.findOne({ jobReference }),
    store.collections.jobPublicViews.findOne({ jobReference }),
  ]);

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found.",
    });
  }

  const metricsMap = await buildJobMetricsMap(store, [job._id]);

  return res.json({
    ok: true,
    job: buildConsultancyJobView(job, publicView, metricsMap.get(String(job._id))),
  });
});

app.patch("/api/consultancy/jobs/:jobReference/review", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const action = normalizeLookupKey(req.body.action);
  const note = sanitizeOptionalText(req.body.note || req.body.reviewComments);
  const consultancyNotes = sanitizeOptionalText(req.body.consultancyNotes);
  const nextStatusByAction = {
    approve: "approved",
    request_changes: "changes_requested",
    reject: "rejected",
  };
  const nextStatus = nextStatusByAction[action];

  if (!nextStatus) {
    return res.status(400).json({
      ok: false,
      message: "Choose a valid consultancy review action.",
    });
  }

  const job = await store.collections.jobs.findOne({ jobReference });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found.",
    });
  }

  const now = new Date();

  await store.collections.jobs.updateOne(
    { _id: job._id },
    {
      $set: {
        status: nextStatus,
        reviewComments: note || "",
        consultancyNotes: consultancyNotes || job.consultancyNotes || "",
        approvedAt: nextStatus === "approved" ? now : job.approvedAt || null,
        updatedAt: now,
      },
    },
  );
  await appendJobStatusHistory(store, {
    jobId: job._id,
    jobReference,
    previousStatus: job.status,
    nextStatus,
    actorRole: "consultancy",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note:
      note ||
      `Consultancy updated the job review status to ${getJobStatusLabel(nextStatus)}.`,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: job.companyAccountId,
    recipientEmail: job.companyEmail || "",
    type: nextStatus === "approved" ? "job_approved" : nextStatus === "changes_requested" ? "job_changes_requested" : "job_rejected",
    title:
      nextStatus === "approved"
        ? "Job approved by consultancy"
        : nextStatus === "changes_requested"
          ? "Consultancy requested job changes"
          : "Job rejected by consultancy",
    message:
      nextStatus === "approved"
        ? `${jobReference} has been approved and is ready for publication review.`
        : nextStatus === "changes_requested"
          ? `${jobReference} needs changes before it can move forward.`
          : `${jobReference} has been rejected by the consultancy team.`,
    entityType: "job",
    entityReference: jobReference,
  });

  return res.json({
    ok: true,
    message: `Job review updated to ${getJobStatusLabel(nextStatus)} successfully.`,
  });
});

app.patch("/api/consultancy/jobs/:jobReference/publish", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({ jobReference });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found.",
    });
  }

  if (!["approved", "published"].includes(job.status)) {
    return res.status(409).json({
      ok: false,
      message: "Only approved jobs can be published to candidates.",
    });
  }

  const overrides = {
    title: sanitizeOptionalText(req.body.title) ?? job.title,
    department: sanitizeOptionalText(req.body.department) ?? job.department,
    description: sanitizeOptionalText(req.body.description) ?? job.description,
    responsibilities: Array.isArray(req.body.responsibilities)
      ? req.body.responsibilities
      : undefined,
    requiredSkills: Array.isArray(req.body.requiredSkills) ? req.body.requiredSkills : undefined,
    preferredSkills: Array.isArray(req.body.preferredSkills) ? req.body.preferredSkills : undefined,
    qualification: sanitizeOptionalText(req.body.qualification) ?? job.qualification,
    location: sanitizeOptionalText(req.body.location) ?? job.location,
    workMode: sanitizeOptionalText(req.body.workMode) ?? job.workMode,
    employmentType: sanitizeOptionalText(req.body.employmentType) ?? job.employmentType,
    shiftDetails: sanitizeOptionalText(req.body.shiftDetails) ?? job.shiftDetails,
    noticePeriodPreference:
      sanitizeOptionalText(req.body.noticePeriodPreference) ?? job.noticePeriodPreference,
    applicationDeadline: req.body.applicationDeadline || job.applicationDeadline,
    screeningQuestions: Array.isArray(req.body.screeningQuestions)
      ? req.body.screeningQuestions
      : undefined,
    candidateAudience: sanitizeOptionalText(req.body.candidateAudience) ?? job.candidateAudience,
    industry: sanitizeOptionalText(req.body.industry) ?? job.industry,
    additionalInformation:
      sanitizeOptionalText(req.body.additionalInformation) ?? job.additionalInformation,
  };
  const publicViewDocument = buildPublicJobViewDocument(job, overrides);
  const combinedPublicText = [
    publicViewDocument.title,
    publicViewDocument.description,
    ...(publicViewDocument.responsibilities || []),
    publicViewDocument.additionalInformation,
  ].join("\n");

  if (
    containsEmployerIdentitySignals(combinedPublicText, [
      job.companyDisplayName,
      job.companyName,
      job.companyEmail,
    ])
  ) {
    return res.status(400).json({
      ok: false,
      message:
        "The public job version still contains company-identifying details. Remove those details before publishing.",
    });
  }

  const now = new Date();

  await store.collections.jobPublicViews.updateOne(
    { jobReference },
    {
      $set: {
        ...publicViewDocument,
        currentStatus: "published",
        publishedAt: job.publishedAt || now,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );
  await store.collections.jobs.updateOne(
    { _id: job._id },
    {
      $set: {
        status: "published",
        publishedAt: job.publishedAt || now,
        updatedAt: now,
      },
    },
  );
  await appendJobStatusHistory(store, {
    jobId: job._id,
    jobReference,
    previousStatus: job.status,
    nextStatus: "published",
    actorRole: "consultancy",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: "Consultancy published the anonymized job to candidates.",
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: job.companyAccountId,
    recipientEmail: job.companyEmail || "",
    type: "job_published",
    title: "Job published successfully",
    message: `${jobReference} is now live for candidate discovery in the consultancy-managed job board.`,
    entityType: "job",
    entityReference: jobReference,
  });

  return res.json({
    ok: true,
    message: "Job published successfully.",
    job: buildCandidateJobView(publicViewDocument),
  });
});

app.patch("/api/consultancy/jobs/:jobReference/status", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const nextStatus = normalizeLookupKey(req.body.status);
  const allowedStatuses = new Set(["under_consultancy_review", "paused", "closed", "archived", "published"]);

  if (!allowedStatuses.has(nextStatus)) {
    return res.status(400).json({
      ok: false,
      message: "Choose a valid consultancy job status update.",
    });
  }

  const jobReference = normalizeTextValue(req.params.jobReference);
  const job = await store.collections.jobs.findOne({ jobReference });

  if (!job) {
    return res.status(404).json({
      ok: false,
      message: "Job not found.",
    });
  }

  const now = new Date();
  const updateSet = {
    status: nextStatus,
    updatedAt: now,
  };

  if (nextStatus === "closed") {
    updateSet.closedAt = now;
  }

  if (nextStatus === "archived") {
    updateSet.archivedAt = now;
  }

  if (nextStatus === "published" && !job.publishedAt) {
    updateSet.publishedAt = now;
  }

  await store.collections.jobs.updateOne({ _id: job._id }, { $set: updateSet });

  if (["published", "paused", "closed", "archived"].includes(nextStatus)) {
    await store.collections.jobPublicViews.updateOne(
      { jobReference },
      {
        $set: {
          currentStatus: nextStatus,
          updatedAt: now,
        },
      },
    );
  }

  if (nextStatus === "closed") {
    const activeStatuses = applicationStatusValues.filter(
      (status) =>
        !["consultancy_rejected", "company_rejected", "not_selected", "selected", "joined", "application_withdrawn", "job_closed"].includes(
          status,
        ),
    );
    await store.collections.applications.updateMany(
      {
        jobId: job._id,
        currentStatus: { $in: activeStatuses },
      },
      {
        $set: {
          currentStatus: "job_closed",
          updatedAt: now,
        },
      },
    );
  }

  await appendJobStatusHistory(store, {
    jobId: job._id,
    jobReference,
    previousStatus: job.status,
    nextStatus,
    actorRole: "consultancy",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: `Consultancy updated the job status to ${getJobStatusLabel(nextStatus)}.`,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: job.companyAccountId,
    recipientEmail: job.companyEmail || "",
    type: "job_status_updated",
    title: "Job status updated",
    message: `${jobReference} is now marked as ${getJobStatusLabel(nextStatus)}.`,
    entityType: "job",
    entityReference: jobReference,
  });

  return res.json({
    ok: true,
    message: `Job status updated to ${getJobStatusLabel(nextStatus)} successfully.`,
  });
});

app.get("/api/consultancy/interests", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const store = getRecruitmentStore();
  const detailsStore = getCandidateDetailsStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const interests = await store.collections.candidateInterests
    .find({})
    .sort({ createdAt: -1, updatedAt: -1 })
    .limit(200)
    .toArray();
  const jobIds = interests.map((interest) => toObjectId(interest.jobId)).filter(Boolean);
  const profileIds = interests.map((interest) => toObjectId(interest.candidateProfileId)).filter(Boolean);
  const [jobs, profiles] = await Promise.all([
    jobIds.length > 0 ? store.collections.jobs.find({ _id: { $in: jobIds } }).toArray() : [],
    profileIds.length > 0
      ? detailsStore.collection.find({ _id: { $in: profileIds } }).toArray()
      : [],
  ]);
  const jobMap = new Map(jobs.map((job) => [String(job._id), job]));
  const profileMap = new Map(profiles.map((profile) => [String(profile._id), profile]));

  return res.json({
    ok: true,
    interests: interests.map((interest) => {
      const job = jobMap.get(String(interest.jobId));
      const profile = profileMap.get(String(interest.candidateProfileId));

      return {
        interestReference: interest.interestReference,
        jobReference: interest.jobReference,
        jobTitle: job?.title || "Job title unavailable",
        companyDisplayName: job?.companyDisplayName || "Company unavailable",
        candidateType: interest.candidateType || profile?.candidateType || "",
        preferredRole: interest.preferredRole || profile?.preferredRole || "",
        location: interest.location || profile?.location || "",
        createdAt: interest.createdAt || null,
        profile: profile ? sanitizeCandidateProfile(profile) : null,
      };
    }),
  });
});

app.get("/api/consultancy/applications", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const store = getRecruitmentStore();
  const detailsStore = getCandidateDetailsStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const filterState = buildConsultancyApplicationFilter(req.query);
  const applications = await store.collections.applications
    .find(filterState.mongoFilter)
    .sort({ updatedAt: -1, appliedAt: -1 })
    .limit(200)
    .toArray();
  const jobIds = applications.map((application) => toObjectId(application.jobId)).filter(Boolean);
  const profileIds = applications
    .map((application) => toObjectId(application.candidateProfileId))
    .filter(Boolean);
  const applicationIds = applications.map((application) => application._id);
  const [jobs, profiles, anonymousProfiles, shares] = await Promise.all([
    jobIds.length > 0 ? store.collections.jobs.find({ _id: { $in: jobIds } }).toArray() : [],
    profileIds.length > 0
      ? detailsStore.collection.find({ _id: { $in: profileIds } }).toArray()
      : [],
    applicationIds.length > 0
      ? store.collections.anonymousCandidateProfiles
          .find({ applicationId: { $in: applicationIds } })
          .toArray()
      : [],
    applicationIds.length > 0
      ? store.collections.anonymousProfileShares
          .find({ applicationId: { $in: applicationIds } })
          .toArray()
      : [],
  ]);
  const jobMap = new Map(jobs.map((job) => [String(job._id), job]));
  const profileMap = new Map(profiles.map((profile) => [String(profile._id), profile]));
  const anonymousMap = new Map(
    anonymousProfiles.map((profile) => [String(profile.applicationId), profile]),
  );
  const shareMap = new Map(shares.map((share) => [String(share.applicationId), share]));
  let rows = applications.map((application) => {
    const job = jobMap.get(String(application.jobId));
    const profile = profileMap.get(String(application.candidateProfileId));
    const anonymousProfile = anonymousMap.get(String(application._id));
    const share = shareMap.get(String(application._id));

    return {
      applicationReference: application.applicationReference,
      jobReference: application.jobReference,
      jobTitle: job?.title || "Job title unavailable",
      companyDisplayName: job?.companyDisplayName || "Company unavailable",
      companyEmail: job?.companyEmail || "",
      candidateType: application.candidateType || "",
      currentStatus: application.currentStatus,
      statusLabel:
        companyVisibleStatusLabels[application.currentStatus] ||
        getJobStatusLabel(application.currentStatus),
      appliedAt: application.appliedAt || null,
      updatedAt: application.updatedAt || null,
      preferredRole:
        profile?.preferredRole ||
        application.candidateProfileSnapshot?.preferredRole ||
        "",
      location:
        profile?.location ||
        application.candidateProfileSnapshot?.location ||
        "",
      skills:
        profile?.skills ||
        application.candidateProfileSnapshot?.skills ||
        "",
      profileStatus: profile?.profileStatus || (application.candidateDeleted ? "deleted" : "unknown"),
      hasAnonymousSummary: Boolean(anonymousProfile),
      sharedWithCompany: Boolean(share),
      anonymousCandidateReference:
        anonymousProfile?.anonymousCandidateReference || share?.anonymousCandidateReference || "",
    };
  });

  if (filterState.companyRegex) {
    rows = rows.filter((row) => filterState.companyRegex.$regex ? new RegExp(filterState.companyRegex.$regex, filterState.companyRegex.$options).test(row.companyDisplayName || "") : true);
  }

  const summary = rows.reduce(
    (totals, row) => {
      totals.totalApplications += 1;

      if (
        [
          "application_submitted",
          "under_consultancy_review",
          "consultancy_screening",
          "additional_information_required",
        ].includes(row.currentStatus)
      ) {
        totals.pendingScreening += 1;
      }

      if (
        [
          "consultancy_shortlisted",
          "anonymous_profile_shared_with_company",
          "company_review_pending",
        ].includes(row.currentStatus)
      ) {
        totals.shortlistedCandidates += 1;
      }

      if (
        ["company_selected_for_interview", "interview_coordination", "interview_scheduled"].includes(
          row.currentStatus,
        )
      ) {
        totals.companyDecisionsPending += 1;
        totals.interviewsInProgress += 1;
      }

      if (row.currentStatus === "selected") {
        totals.selectedCandidates += 1;
      }

      if (row.currentStatus === "joined") {
        totals.joinedCandidates += 1;
      }

      return totals;
    },
    {
      totalApplications: 0,
      pendingScreening: 0,
      shortlistedCandidates: 0,
      companyDecisionsPending: 0,
      interviewsInProgress: 0,
      selectedCandidates: 0,
      joinedCandidates: 0,
    },
  );

  return res.json({
    ok: true,
    summary,
    applications: rows,
  });
});

app.get("/api/consultancy/applications/:applicationReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const store = getRecruitmentStore();
  const detailsStore = getCandidateDetailsStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.params.applicationReference);
  const application = await store.collections.applications.findOne({ applicationReference });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found.",
    });
  }

  const [job, profile, anonymousProfile, shares, notes, interviews] = await Promise.all([
    store.collections.jobs.findOne({ _id: toObjectId(application.jobId) }),
    application.candidateProfileId
      ? detailsStore.collection.findOne({ _id: toObjectId(application.candidateProfileId) })
      : null,
    store.collections.anonymousCandidateProfiles.findOne({ applicationId: application._id }),
    store.collections.anonymousProfileShares
      .find({ applicationId: application._id })
      .sort({ sharedAt: -1, createdAt: -1 })
      .toArray(),
    store.collections.consultancyNotes
      .find({ applicationReference })
      .sort({ createdAt: -1 })
      .toArray(),
    store.collections.interviews
      .find({ applicationReference })
      .sort({ createdAt: -1 })
      .toArray(),
  ]);

  return res.json({
    ok: true,
    application: {
      applicationReference: application.applicationReference,
      jobReference: application.jobReference,
      companyDisplayName: job?.companyDisplayName || "Company unavailable",
      companyEmail: job?.companyEmail || "",
      jobTitle: job?.title || "Job title unavailable",
      candidateType: application.candidateType || "",
      currentStatus: application.currentStatus,
      statusLabel: getJobStatusLabel(application.currentStatus),
      appliedAt: application.appliedAt || null,
      updatedAt: application.updatedAt || null,
      screeningAnswers: application.screeningAnswers || [],
      candidateProfileSnapshot: application.candidateProfileSnapshot || null,
      candidateProfile: profile ? sanitizeCandidateProfile(profile) : null,
      anonymousProfile,
      shares: shares.map((share) => ({
        shareReference: share.shareReference,
        anonymousCandidateReference: share.anonymousCandidateReference || "",
        sharedAt: share.sharedAt || null,
      })),
      notes: notes.map((note) => ({
        id: String(note._id),
        note: note.note,
        createdAt: note.createdAt || null,
      })),
      interviews: interviews.map((interview) => ({
        interviewReference: interview.interviewReference,
        scheduledAt: interview.scheduledAt || null,
        mode: interview.mode || "",
        location: interview.location || "",
        status: interview.status || "",
        result: interview.result || "",
        note: interview.note || "",
        createdAt: interview.createdAt || null,
        updatedAt: interview.updatedAt || null,
      })),
    },
  });
});

app.patch("/api/consultancy/applications/:applicationReference/status", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.params.applicationReference);
  const nextStatus = normalizeLookupKey(req.body.status);
  const note = sanitizeOptionalText(req.body.note);

  if (!applicationStatusValues.includes(nextStatus)) {
    return res.status(400).json({
      ok: false,
      message: "Choose a valid application status.",
    });
  }

  const application = await store.collections.applications.findOne({ applicationReference });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found.",
    });
  }

  const now = new Date();

  await store.collections.applications.updateOne(
    { _id: application._id },
    {
      $set: {
        currentStatus: nextStatus,
        updatedAt: now,
      },
    },
  );
  await appendApplicationStatusHistory(store, {
    applicationId: application._id,
    applicationReference,
    previousStatus: application.currentStatus,
    nextStatus,
    actorRole: "consultancy",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: note || `Consultancy updated the application status to ${getJobStatusLabel(nextStatus)}.`,
  });
  await createNotification(store, {
    recipientRole: "candidate",
    recipientAccountId: application.candidateLoginId,
    type: "application_status_changed",
    title: "Application status updated",
    message:
      candidateFriendlyStatusLabels[nextStatus] ||
      `Your application status is now ${getJobStatusLabel(nextStatus)}.`,
    entityType: "application",
    entityReference: applicationReference,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: application.companyAccountId,
    type: "consultancy_update_available",
    title: "Consultancy updated an application",
    message: `${application.jobReference} has an updated anonymous application status.`,
    entityType: "application",
    entityReference: applicationReference,
  });

  return res.json({
    ok: true,
    message: `Application status updated to ${getJobStatusLabel(nextStatus)} successfully.`,
  });
});

app.post("/api/consultancy/applications/:applicationReference/notes", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.params.applicationReference);
  const note = normalizeTextValue(req.body.note);

  if (!note) {
    return res.status(400).json({
      ok: false,
      message: "Enter a note before saving.",
    });
  }

  const application = await store.collections.applications.findOne({ applicationReference });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found.",
    });
  }

  const now = new Date();

  await store.collections.consultancyNotes.insertOne({
    applicationId: application._id,
    applicationReference,
    note,
    createdByCredentialId: authContext.credential._id,
    createdByEmail: authContext.credential.email,
    createdAt: now,
    updatedAt: now,
  });

  return res.status(201).json({
    ok: true,
    message: "Consultancy note saved successfully.",
  });
});

app.post("/api/consultancy/applications/:applicationReference/anonymize", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const store = getRecruitmentStore();
  const detailsStore = getCandidateDetailsStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.params.applicationReference);
  const application = await store.collections.applications.findOne({ applicationReference });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found.",
    });
  }

  const profile = application.candidateProfileId
    ? await detailsStore.collection.findOne({ _id: toObjectId(application.candidateProfileId) })
    : null;

  if (!profile) {
    return res.status(404).json({
      ok: false,
      message: "Candidate profile could not be loaded for anonymization.",
    });
  }

  const existingAnonymousProfile = await store.collections.anonymousCandidateProfiles.findOne({
    applicationId: application._id,
  });
  const anonymousCandidateReference =
    existingAnonymousProfile?.anonymousCandidateReference ||
    createPublicReference(
      "CAN",
      await getNextSequenceValue(store.collections.counters, "anonymousCandidateReference"),
    );
  const now = new Date();
  const summary = buildAnonymousCandidateSummaryFromProfile(profile, application, req.body);

  await store.collections.anonymousCandidateProfiles.updateOne(
    { applicationId: application._id },
    {
      $set: {
        applicationId: application._id,
        applicationReference,
        jobId: application.jobId,
        jobReference: application.jobReference,
        companyAccountId: application.companyAccountId,
        anonymousCandidateReference,
        ...summary,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return res.json({
    ok: true,
    message: "Anonymous candidate summary prepared successfully.",
    anonymousCandidateReference,
    summary,
  });
});

app.post("/api/consultancy/applications/:applicationReference/share", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.params.applicationReference);
  const application = await store.collections.applications.findOne({ applicationReference });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found.",
    });
  }

  const anonymousProfile = await store.collections.anonymousCandidateProfiles.findOne({
    applicationId: application._id,
  });

  if (!anonymousProfile) {
    return res.status(400).json({
      ok: false,
      message: "Create the anonymous candidate summary before sharing it with the company.",
    });
  }

  const existingShare = await store.collections.anonymousProfileShares.findOne({
    applicationId: application._id,
    jobId: application.jobId,
    companyAccountId: application.companyAccountId,
  });

  if (existingShare) {
    return res.json({
      ok: true,
      message: "Anonymous candidate summary has already been shared with the company.",
      shareReference: existingShare.shareReference,
    });
  }

  const shareReference = createPublicReference(
    "SHR",
    await getNextSequenceValue(store.collections.counters, "anonymousShareReference"),
  );
  const now = new Date();

  await store.collections.anonymousProfileShares.insertOne({
    shareReference,
    applicationId: application._id,
    applicationReference,
    jobId: application.jobId,
    jobReference: application.jobReference,
    companyAccountId: application.companyAccountId,
    anonymousCandidateProfileId: anonymousProfile._id,
    anonymousCandidateReference: anonymousProfile.anonymousCandidateReference,
    sharedAt: now,
    createdAt: now,
    updatedAt: now,
  });
  await store.collections.applications.updateOne(
    { _id: application._id },
    {
      $set: {
        currentStatus: "anonymous_profile_shared_with_company",
        updatedAt: now,
      },
    },
  );
  await appendApplicationStatusHistory(store, {
    applicationId: application._id,
    applicationReference,
    previousStatus: application.currentStatus,
    nextStatus: "anonymous_profile_shared_with_company",
    actorRole: "consultancy",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note: "Anonymous candidate summary shared with the company.",
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: application.companyAccountId,
    type: "anonymous_candidate_summary_available",
    title: "Anonymous candidate summary available",
    message: `${application.jobReference} has a new anonymized candidate summary ready for review.`,
    entityType: "application",
    entityReference: applicationReference,
  });

  return res.json({
    ok: true,
    message: "Anonymous candidate summary shared with the company successfully.",
    shareReference,
  });
});

app.post("/api/consultancy/interviews", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const applicationReference = normalizeTextValue(req.body.applicationReference);
  const application = await store.collections.applications.findOne({ applicationReference });

  if (!application) {
    return res.status(404).json({
      ok: false,
      message: "Application not found for interview coordination.",
    });
  }

  const scheduledAt = coerceDateValue(req.body.scheduledAt);
  const mode = normalizeTextValue(req.body.mode || "Consultancy coordination");
  const location = normalizeTextValue(req.body.location);
  const note = normalizeTextValue(req.body.note);
  const status = scheduledAt ? "interview_scheduled" : "interview_coordination";
  const interviewReference = createPublicReference(
    "INTV",
    await getNextSequenceValue(store.collections.counters, "interviewReference"),
  );
  const now = new Date();

  await store.collections.interviews.insertOne({
    interviewReference,
    applicationId: application._id,
    applicationReference,
    jobId: application.jobId,
    jobReference: application.jobReference,
    companyAccountId: application.companyAccountId,
    candidateLoginId: application.candidateLoginId || null,
    candidateProfileId: application.candidateProfileId || null,
    status,
    scheduledAt,
    mode,
    location,
    note,
    result: "",
    createdAt: now,
    updatedAt: now,
  });
  await store.collections.applications.updateOne(
    { _id: application._id },
    {
      $set: {
        currentStatus: status,
        updatedAt: now,
      },
    },
  );
  await appendApplicationStatusHistory(store, {
    applicationId: application._id,
    applicationReference,
    previousStatus: application.currentStatus,
    nextStatus: status,
    actorRole: "consultancy",
    actorCredentialId: authContext.credential._id,
    actorEmail: authContext.credential.email,
    note:
      status === "interview_scheduled"
        ? "Consultancy scheduled the interview."
        : "Consultancy started interview coordination.",
  });
  await createNotification(store, {
    recipientRole: "candidate",
    recipientAccountId: application.candidateLoginId,
    type: status === "interview_scheduled" ? "interview_scheduled" : "interview_coordination_started",
    title: status === "interview_scheduled" ? "Interview scheduled" : "Interview coordination started",
    message:
      status === "interview_scheduled"
        ? `Your interview has been scheduled. Our recruitment team will coordinate the remaining details with you.`
        : `Interview coordination has started for your application.`,
    entityType: "interview",
    entityReference: interviewReference,
  });
  await createNotification(store, {
    recipientRole: "company",
    recipientAccountId: application.companyAccountId,
    type: "interview_update_available",
    title: "Interview update available",
    message: `${application.jobReference} has a new interview coordination update.`,
    entityType: "interview",
    entityReference: interviewReference,
  });

  return res.status(201).json({
    ok: true,
    message:
      status === "interview_scheduled"
        ? "Interview scheduled successfully."
        : "Interview coordination started successfully.",
    interviewReference,
  });
});

app.patch("/api/consultancy/interviews/:interviewReference", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "consultancy");

  if (!authContext) {
    return;
  }

  const store = getRecruitmentStore();

  if (!store) {
    return res.status(503).json({
      ok: false,
      message: "Recruitment storage is not ready yet.",
    });
  }

  const interviewReference = normalizeTextValue(req.params.interviewReference);
  const interview = await store.collections.interviews.findOne({ interviewReference });

  if (!interview) {
    return res.status(404).json({
      ok: false,
      message: "Interview not found.",
    });
  }

  const nextStatus = normalizeLookupKey(req.body.status || interview.status);
  const allowedStatuses = new Set([
    "interview_coordination",
    "interview_scheduled",
    "interview_completed",
    "offer_discussion",
    "selected",
    "not_selected",
    "joined",
    "on_hold",
  ]);

  if (!allowedStatuses.has(nextStatus)) {
    return res.status(400).json({
      ok: false,
      message: "Choose a valid interview or final outcome status.",
    });
  }

  const now = new Date();
  const scheduledAt = coerceDateValue(req.body.scheduledAt || interview.scheduledAt);
  const mode = normalizeTextValue(req.body.mode || interview.mode);
  const location = normalizeTextValue(req.body.location || interview.location);
  const note = normalizeTextValue(req.body.note || interview.note);
  const result = normalizeTextValue(req.body.result || interview.result);

  await store.collections.interviews.updateOne(
    { _id: interview._id },
    {
      $set: {
        status: nextStatus,
        scheduledAt,
        mode,
        location,
        note,
        result,
        updatedAt: now,
      },
    },
  );

  const application = await store.collections.applications.findOne({
    applicationReference: interview.applicationReference,
  });

  if (application) {
    await store.collections.applications.updateOne(
      { _id: application._id },
      {
        $set: {
          currentStatus: nextStatus,
          updatedAt: now,
        },
      },
    );
    await appendApplicationStatusHistory(store, {
      applicationId: application._id,
      applicationReference: application.applicationReference,
      previousStatus: application.currentStatus,
      nextStatus,
      actorRole: "consultancy",
      actorCredentialId: authContext.credential._id,
      actorEmail: authContext.credential.email,
      note: note || `Interview update moved the application to ${getJobStatusLabel(nextStatus)}.`,
    });
    await createNotification(store, {
      recipientRole: "candidate",
      recipientAccountId: application.candidateLoginId,
      type: "application_status_changed",
      title: "Interview process updated",
      message:
        candidateFriendlyStatusLabels[nextStatus] ||
        `Your interview status is now ${getJobStatusLabel(nextStatus)}.`,
      entityType: "interview",
      entityReference: interviewReference,
    });
    await createNotification(store, {
      recipientRole: "company",
      recipientAccountId: application.companyAccountId,
      type: "interview_update_available",
      title: "Interview process updated",
      message: `${application.jobReference} has a new interview outcome update.`,
      entityType: "interview",
      entityReference: interviewReference,
    });
  }

  return res.json({
    ok: true,
    message: "Interview details updated successfully.",
  });
});

async function saveCandidateProfileRecord(req, res) {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const validation = validateCandidateProfilePayload(req.body);

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const candidateStore = getCandidateStore();
  const detailsStore = getCandidateDetailsStore();
  const credential = authContext.credential;

  if (validation.email !== credential.email) {
    return res.status(403).json({
      ok: false,
      message: "Use the same email address as your logged-in candidate account.",
    });
  }

  if (credential.consent !== true && !credential.consentAcceptedAt) {
    return res.status(403).json({
      ok: false,
      message: "Candidate consent must be approved before profile details can be stored.",
    });
  }

  const now = new Date();
  const existingProfile = await detailsStore.collection.findOne(
    { email: validation.email },
    {
      projection: {
        _id: 1,
        createdAt: 1,
        isVisibleForHiring: 1,
        profileStatus: 1,
        deactivatedAt: 1,
        profileData: 1,
      },
    },
  );
  const visibility = existingProfile
    ? getCandidateProfileVisibility(existingProfile)
    : { isVisibleForHiring: true, profileStatus: "active" };

  const profileUpdate = {
    candidateCredentialId: String(credential._id),
    candidateLoginEmail: credential.email,
    candidateLoginName: validation.fullName,
    consent: true,
    profileStatus: visibility.profileStatus,
    isVisibleForHiring: visibility.isVisibleForHiring,
    deactivatedAt: visibility.isVisibleForHiring ? null : existingProfile?.deactivatedAt || now,
    candidateType: validation.candidateType,
    fullName: validation.fullName,
    email: validation.email,
    phone: validation.phone,
    location: validation.location,
    preferredRole: validation.preferredRole,
    preferredWorkLocation: validation.preferredWorkLocation,
    skills: validation.skills,
    skillList: validation.skillList,
    summary: validation.summary,
    fresherDetails: validation.fresherDetails,
    experiencedDetails: validation.experiencedDetails,
    submittedAt: now,
    updatedAt: now,
  };

  // The dashboard editor updates the original field set. It must not erase the
  // additional details saved through the newer multi-step profile form.
  if (validation.profileData !== null) {
    profileUpdate.profileData = validation.profileData;
  } else if (!existingProfile?.profileData) {
    profileUpdate.profileData = null;
  }

  try {
    await detailsStore.collection.updateOne(
      { email: validation.email },
      {
        $set: profileUpdate,
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    console.error("Candidate profile save failed:", error.message);

    if (error?.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "A candidate profile already exists with these details. Refresh the page and try again.",
      });
    }

    if (isMongoConnectivityError(error)) {
      resetCandidateDetailsConnection().catch(() => {});
      scheduleCandidateDetailsReconnect();
      return res.status(503).json({
        ok: false,
        message: "Candidate profile storage is temporarily unavailable. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "We could not save your profile changes. Please refresh the page and try again.",
    });
  }

  // Keep the login display name aligned with the profile, but never reject a
  // successfully saved profile because this secondary display-name update fails.
  try {
    await candidateStore.collection.updateOne(
      { _id: credential._id },
      {
        $set: {
          name: validation.fullName,
          updatedAt: now,
        },
      },
    );
  } catch (error) {
    console.warn("Candidate login display-name update failed:", error.message);
  }

  const savedProfile = await detailsStore.collection.findOne({ email: validation.email });
  await broadcastCompanyDashboardSnapshot();

  return res.json({
    ok: true,
    message: existingProfile
      ? "Candidate details updated successfully."
      : "Candidate details saved successfully.",
    profile: sanitizeCandidateProfile(savedProfile),
    storage: {
      databaseName: detailsStore.databaseName,
      collectionName: detailsStore.collectionName,
      uriSource: detailsStore.uriSource || candidateDetailsUriSource,
      usesPrimaryConnection:
        detailsStore.usesPrimaryConnection ?? candidateDetailsUsesPrimaryConnection,
    },
  });
}

app.post("/api/auth/register", async (req, res) => {
  if (!enforceSensitiveRateLimit(req, "register", 10, 15 * 60 * 1000)) {
    return res.status(429).json({
      ok: false,
      message: "Too many registration attempts. Please wait a few minutes and try again.",
    });
  }

  if (!(await ensureDatabaseConnection())) {
    return res.status(503).json({
      ok: false,
      message: getDatabaseUnavailableMessage(),
    });
  }

  const validation = validateCredentialPayload(req.body, {
    requirePasswordConfirmation: true,
    requireCandidateName: true,
  });

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const { role, name, email, password } = validation;
  const store = getRoleStore(role);
  const existingCredential = await store.collection.findOne({ email });

  if (existingCredential) {
    return res.status(409).json({
      ok: false,
      message: `An account already exists in ${getRoleLabel(role)} login storage for this email.`,
    });
  }

  const now = new Date();
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newCredentialDocument = {
    role,
    name,
    email,
    passwordHash,
    createdAt: now,
    lastLoginAt: null,
    consent: role === "candidate" ? false : null,
    consentAcceptedAt: role === "candidate" ? null : null,
    consentVersion: role === "candidate" ? null : null,
    consentSource: role === "candidate" ? null : null,
    updatedAt: now,
  };

  let insertResult;

  try {
    insertResult = await store.collection.insertOne(newCredentialDocument);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: `An account already exists in ${getRoleLabel(role)} login storage for this email.`,
      });
    }

    throw error;
  }

  const createdCredential = {
    _id: insertResult.insertedId,
    ...newCredentialDocument,
  };

  if (role === "candidate") {
    broadcastCompanyDashboardSnapshot().catch((error) => {
      console.warn("Candidate registration dashboard sync failed:", error.message);
    });
  }

  return res.status(201).json({
    ok: true,
    message: `${getRoleLabel(role)} credentials created successfully in ${store.databaseName}.`,
    credential: sanitizeCredential(createdCredential),
    storage: {
      databaseName: store.databaseName,
      collectionName: store.collectionName,
    },
  });
});

app.post("/api/auth/login", async (req, res) => {
  if (!enforceSensitiveRateLimit(req, "login", 20, 15 * 60 * 1000)) {
    return res.status(429).json({
      ok: false,
      message: "Too many login attempts. Please wait a few minutes and try again.",
    });
  }

  if (!(await ensureDatabaseConnection())) {
    return res.status(503).json({
      ok: false,
      message: getDatabaseUnavailableMessage(),
    });
  }

  const validation = validateCredentialPayload(req.body);

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const { role, email, password } = validation;
  const store = getRoleStore(role);
  const credential = await store.collection.findOne({ email });

  if (!credential) {
    return res.status(401).json({
      ok: false,
      message: "Invalid email, password, or login type.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, credential.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({
      ok: false,
      message: "Invalid email, password, or login type.",
    });
  }

  const loginTime = new Date();

  await store.collection.updateOne(
    { _id: credential._id },
    {
      $set: {
        lastLoginAt: loginTime,
        updatedAt: loginTime,
      },
    },
  );

  credential.lastLoginAt = loginTime;
  credential.updatedAt = loginTime;

  const session = await createAuthSession(req, res, credential);

  return res.json({
    ok: true,
    message: `${getRoleLabel(role)} login successful.`,
    credential: sanitizeCredential(credential),
    session: {
      expiresAt: session.expiresAt,
    },
    storage: {
      databaseName: store.databaseName,
      collectionName: store.collectionName,
    },
  });
});

app.post("/api/auth/candidate-consent", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  const store = getRoleStore("candidate");
  const credential = authContext.credential;

  if (credential.consentAcceptedAt && credential.consentVersion === candidateConsentVersion) {
    if (credential.consent !== true) {
      await store.collection.updateOne(
        { _id: credential._id },
        {
          $set: {
            consent: true,
            updatedAt: new Date(),
          },
        },
      );
      credential.consent = true;
    }

    return res.json({
      ok: true,
      message: "Candidate consent is already recorded.",
      credential: sanitizeCredential(credential),
      storage: {
        databaseName: store.databaseName,
        collectionName: store.collectionName,
      },
    });
  }

  const now = new Date();

  await store.collection.updateOne(
    { _id: credential._id },
    {
      $set: {
        consent: true,
        consentAcceptedAt: now,
        consentVersion: candidateConsentVersion,
        consentSource: candidateConsentSource,
        updatedAt: now,
      },
    },
  );

  credential.consent = true;
  credential.consentAcceptedAt = now;
  credential.consentVersion = candidateConsentVersion;
  credential.consentSource = candidateConsentSource;
  credential.updatedAt = now;

  return res.json({
    ok: true,
    message: "Candidate consent recorded successfully.",
    credential: sanitizeCredential(credential),
    storage: {
      databaseName: store.databaseName,
      collectionName: store.collectionName,
    },
  });
});

app.get("/api/candidate/profile", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const candidateStore = getCandidateStore();
  const detailsStore = getCandidateDetailsStore();
  const credential = authContext.credential;

  const profile = await detailsStore.collection.findOne({ email: credential.email });

  if (!profile) {
    return res.status(404).json({
      ok: false,
      message: "Candidate profile not found yet. Complete the application form first.",
    });
  }

  return res.json({
    ok: true,
    message: "Candidate profile loaded successfully.",
    credential: sanitizeCredential(credential),
    profile: sanitizeCandidateProfile(profile),
    storage: {
      databaseName: detailsStore.databaseName,
      collectionName: detailsStore.collectionName,
      uriSource: detailsStore.uriSource || candidateDetailsUriSource,
      usesPrimaryConnection:
        detailsStore.usesPrimaryConnection ?? candidateDetailsUsesPrimaryConnection,
    },
  });
});

app.post("/api/candidate/profile", saveCandidateProfileRecord);
app.put("/api/candidate/profile", saveCandidateProfileRecord);

app.patch("/api/candidate/profile/status", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const validation = validateCandidateProfileStatusPayload(req.body);

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const candidateStore = getCandidateStore();
  const detailsStore = getCandidateDetailsStore();
  const credential = authContext.credential;

  if (validation.email !== credential.email) {
    return res.status(403).json({
      ok: false,
      message: "You can update only your own candidate profile visibility.",
    });
  }

  const existingProfile = await detailsStore.collection.findOne({ email: credential.email });

  if (!existingProfile) {
    return res.status(404).json({
      ok: false,
      message: "Candidate profile not found yet. Complete the application form first.",
    });
  }

  const now = new Date();
  const nextStatus = validation.isVisibleForHiring ? "active" : "deactivated";

  await detailsStore.collection.updateOne(
    { email: credential.email },
    {
      $set: {
        isVisibleForHiring: validation.isVisibleForHiring,
        profileStatus: nextStatus,
        deactivatedAt: validation.isVisibleForHiring ? null : now,
        updatedAt: now,
      },
    },
  );

  const updatedProfile = await detailsStore.collection.findOne({ email: credential.email });
  await broadcastCompanyDashboardSnapshot();

  return res.json({
    ok: true,
    message: validation.isVisibleForHiring
      ? "Candidate profile is active for hiring again."
      : "Candidate profile has been deactivated for hiring.",
    credential: sanitizeCredential(credential),
    profile: sanitizeCandidateProfile(updatedProfile),
    storage: {
      databaseName: detailsStore.databaseName,
      collectionName: detailsStore.collectionName,
      uriSource: detailsStore.uriSource || candidateDetailsUriSource,
      usesPrimaryConnection:
        detailsStore.usesPrimaryConnection ?? candidateDetailsUsesPrimaryConnection,
    },
  });
});

app.delete("/api/candidate/profile", async (req, res) => {
  const authContext = await requireAuthenticatedRole(req, res, "candidate");

  if (!authContext) {
    return;
  }

  if (!(await ensureCandidateDetailsConnection())) {
    return res.status(503).json({
      ok: false,
      message: getCandidateDetailsUnavailableMessage(),
    });
  }

  const candidateStore = getCandidateStore();
  const detailsStore = getCandidateDetailsStore();
  const recruitment = getRecruitmentStore();
  const credential = authContext.credential;
  const existingProfile = await detailsStore.collection.findOne({ email: credential.email });

  if (recruitment && existingProfile?._id) {
    const now = new Date();
    const candidateProfileId = existingProfile._id;
    const candidateLoginId = credential._id;

    await Promise.all([
      recruitment.collections.applications.updateMany(
        {
          $or: [{ candidateProfileId }, { candidateLoginId }],
        },
        {
          $set: {
            candidateProfileId: null,
            candidateLoginId: null,
            candidateDeleted: true,
            candidateDeletedAt: now,
            updatedAt: now,
          },
        },
      ),
      recruitment.collections.candidateInterests.updateMany(
        {
          $or: [{ candidateProfileId }, { candidateLoginId }],
        },
        {
          $set: {
            candidateProfileId: null,
            candidateLoginId: null,
            candidateDeleted: true,
            candidateDeletedAt: now,
            updatedAt: now,
          },
        },
      ),
      recruitment.collections.sessions.deleteMany({
        credentialId: credential._id,
        role: "candidate",
      }),
      recruitment.collections.notifications.deleteMany({
        recipientRole: "candidate",
        recipientAccountId: credential._id,
      }),
    ]);
  }

  const [profileDeleteResult, credentialDeleteResult] = await Promise.all([
    detailsStore.collection.deleteOne({ email: credential.email }),
    candidateStore.collection.deleteOne({ email: credential.email }),
  ]);

  await destroyAuthSession(req, res);
  await broadcastCompanyDashboardSnapshot();

  return res.json({
    ok: true,
    message: "Candidate profile and login account deleted successfully.",
    deleted: {
      profile: profileDeleteResult.deletedCount > 0,
      login: credentialDeleteResult.deletedCount > 0,
    },
    storage: {
      loginDatabaseName: candidateStore.databaseName,
      loginCollectionName: candidateStore.collectionName,
      profileDatabaseName: detailsStore.databaseName,
      profileCollectionName: detailsStore.collectionName,
    },
  });
});

app.post("/api/auth/forgot-password", async (req, res) => {
  if (!enforceSensitiveRateLimit(req, "forgot-password", 10, 15 * 60 * 1000)) {
    return res.status(429).json({
      ok: false,
      message: "Too many OTP requests. Please wait a few minutes and try again.",
    });
  }

  if (!(await ensureDatabaseConnection())) {
    return res.status(503).json({
      ok: false,
      message: getDatabaseUnavailableMessage(),
    });
  }

  const validation = validateForgotPasswordPayload(req.body);

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const { role, email } = validation;
  const successMessage = getForgotPasswordSuccessMessage();
  const store = getRoleStore(role);
  const credential = await store.collection.findOne({ email });

  if (!credential) {
    return res.json({
      ok: true,
      message: successMessage,
      cooldownSeconds: resetOtpCooldownSeconds,
    });
  }

  try {
    await verifyMailTransporterReady();
  } catch (error) {
    console.error("Password reset mail configuration failed:", error.message);
    return res.status(503).json({
      ok: false,
      message: getMailConfigurationMessage(),
    });
  }

  const otp = generateResetOtp();
  const otpHash = await bcrypt.hash(otp, saltRounds);
  const requestedAt = new Date();
  const expiresAt = getResetOtpExpiryDate(requestedAt);
  const reserveResult = await store.collection.updateOne(
    buildResetOtpCooldownFilter(credential._id, requestedAt),
    {
      $set: {
        resetOtpHash: otpHash,
        resetOtpExpiresAt: expiresAt,
        resetOtpRequestedAt: requestedAt,
        resetOtpAttemptCount: 0,
        updatedAt: requestedAt,
      },
    },
  );

  if (!reserveResult.matchedCount) {
    const latestCredential = await store.collection.findOne(
      { _id: credential._id },
      {
        projection: {
          resetOtpRequestedAt: 1,
        },
      },
    );

    return res.status(429).json({
      ok: false,
      message: "Please wait before requesting another OTP.",
      retryAfterSeconds: getResetOtpRetryAfterSeconds(
        latestCredential?.resetOtpRequestedAt,
        new Date(),
      ),
    });
  }

  try {
    await sendResetOtpEmail({
      transporter: getMailTransporter(),
      role,
      to: credential.email,
      name: credential.name,
      otp,
    });
  } catch (error) {
    await clearResetStateForOtpRequest(
      store,
      credential._id,
      {
        otpHash,
        requestedAt,
        expiresAt,
      },
      new Date(),
    );
    console.error("Password reset OTP send failed:", error.message);
    return res.status(503).json({
      ok: false,
      message: "Unable to send the OTP email right now. Check the Gmail SMTP settings and try again.",
    });
  }

  return res.json({
    ok: true,
    message: `${successMessage} The code expires in ${resetOtpExpiryMinutes} minutes.`,
    cooldownSeconds: resetOtpCooldownSeconds,
  });
});

app.post("/api/auth/reset-password", async (req, res) => {
  if (!enforceSensitiveRateLimit(req, "reset-password", 12, 15 * 60 * 1000)) {
    return res.status(429).json({
      ok: false,
      message: "Too many password reset attempts. Please wait a few minutes and try again.",
    });
  }

  if (!(await ensureDatabaseConnection())) {
    return res.status(503).json({
      ok: false,
      message: getDatabaseUnavailableMessage(),
    });
  }

  const validation = validateResetPasswordPayload(req.body);

  if (validation.error) {
    return res.status(400).json({
      ok: false,
      message: validation.error,
    });
  }

  const { role, email, password, otp } = validation;
  const store = getRoleStore(role);
  const credential = await store.collection.findOne({ email });

  if (!credential || !credential.resetOtpHash || !credential.resetOtpExpiresAt) {
    return res.status(400).json({
      ok: false,
      message: "Request a new OTP before resetting your password.",
    });
  }

  const now = new Date();
  const expiresAt = new Date(credential.resetOtpExpiresAt);

  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < now.getTime()) {
    await clearResetState(store, credential._id, now);

    return res.status(400).json({
      ok: false,
      message: "This OTP has expired. Request a new one and try again.",
    });
  }

  const attemptCount = Number(credential.resetOtpAttemptCount || 0);

  if (attemptCount >= resetOtpMaxAttempts) {
    await clearResetState(store, credential._id, now);

    return res.status(400).json({
      ok: false,
      message: "Too many invalid OTP attempts. Request a new code and try again.",
    });
  }

  const otpMatches = await bcrypt.compare(otp, credential.resetOtpHash);

  if (!otpMatches) {
    const nextAttemptCount = attemptCount + 1;

    if (nextAttemptCount >= resetOtpMaxAttempts) {
      await clearResetState(store, credential._id, now);

      return res.status(400).json({
        ok: false,
        message: "Too many invalid OTP attempts. Request a new code and try again.",
      });
    }

    await store.collection.updateOne(
      { _id: credential._id },
      {
        $set: {
          resetOtpAttemptCount: nextAttemptCount,
          updatedAt: now,
        },
      },
    );

    return res.status(400).json({
      ok: false,
      message: `Invalid OTP. You have ${resetOtpMaxAttempts - nextAttemptCount} attempt(s) remaining.`,
    });
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  await store.collection.updateOne(
    { _id: credential._id },
    buildResetStateClearUpdate(now, {
      passwordHash,
      lastPasswordResetAt: now,
    }),
  );

  const recruitment = getRecruitmentStore();
  if (recruitment && role === "candidate") {
    await recruitment.collections.sessions.deleteMany({ credentialId: credential._id, role: "candidate" });
  }

  return res.json({
    ok: true,
    message: `${getRoleLabel(role)} password reset successful. You can log in now.`,
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      ok: false,
      message: "Request body must be valid JSON.",
    });
  }

  console.error("Request failed:", error.message);

  if (isMongoConnectivityError(error)) {
    resetPrimaryDatabaseConnection().catch(() => {});
    resetCandidateDetailsConnection().catch(() => {});
    scheduleDatabaseReconnect();
    scheduleCandidateDetailsReconnect();

    return res.status(503).json({
      ok: false,
      message:
        "Database connection timed out while reaching MongoDB Atlas. Please try again in a moment.",
    });
  }

  return res.status(500).json({
    ok: false,
    message: "Unexpected server error.",
  });
});

app.use("/api", (_req, res) => {
  return res.status(404).json({
    ok: false,
    message: "API route not found.",
  });
});

app.get("/{*any}", (_req, res) => {
  if (!hasPublishedAssets()) {
    return res.status(500).json({
      ok: false,
      message:
        "Static assets are missing. Run `npm run build` to prepare the Vercel public directory.",
    });
  }

  return res.sendFile(getPublishedFilePath("index.html"));
});

async function startServer() {
  await initializeDatabaseConnection();
  await initializeCandidateDetailsConnection();

  app.listen(port, () => {
    console.log(`Recruitment portal server running on http://127.0.0.1:${port}`);
  });
}

process.on("SIGINT", async () => {
  if (databaseRetryTimer) {
    clearTimeout(databaseRetryTimer);
  }

  if (candidateDetailsRetryTimer) {
    clearTimeout(candidateDetailsRetryTimer);
  }

  if (mongoClient) {
    await mongoClient.close();
  }

  if (candidateDetailsClient) {
    await candidateDetailsClient.close();
  }

  process.exit(0);
});

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
} else if (String(process.env.NODE_ENV || "").trim().toLowerCase() !== "test") {
  initializeDatabaseConnection().catch(() => {});
  initializeCandidateDetailsConnection().catch(() => {});
}

module.exports = app;
module.exports.__testables = {
  buildCandidateJobFilter,
  buildCandidateJobView,
  buildCandidateProfileSnapshot,
  buildCompanyAnonymousCandidateView,
  buildCompanyJobView,
  buildConsultancyApplicationFilter,
  buildConsultancyJobFilter,
  buildInternalJobDocument,
  buildPublicJobViewDocument,
  containsEmployerIdentitySignals,
  createPublicReference,
  getCandidateExperienceSummary,
  getCandidateQualificationValue,
  getCandidateRelevantExperienceSummary,
  getCandidateProfileVisibility,
  isCandidateProfileEligibleForHiring,
  isPublicJobActive,
  summarizeApplicationStatusCounts,
  serializeNotificationView,
  toJobValidationPayload,
  validateCandidateAccessForRecruitment,
  validateJobPayload,
  validateScreeningAnswers,
};
