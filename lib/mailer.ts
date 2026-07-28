import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";

const defaultSenderEmail = "onequicksolutionsinfo@gmail.com";
const smtpHost = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpSecure =
  String(process.env.SMTP_SECURE || "").trim().toLowerCase() === "true" || smtpPort === 465;
const smtpUser = String(process.env.SMTP_USER || defaultSenderEmail).trim();
const smtpPass = String(process.env.SMTP_PASS || "").trim();
const smtpFrom = String(process.env.SMTP_FROM || smtpUser || defaultSenderEmail).trim();
const smtpFromName = String(process.env.SMTP_FROM_NAME || "OneQuickSolutions Website").trim();

let transporter: Transporter | null = null;
let verifyPromise: Promise<void> | null = null;

export function getMailConfigurationMessage() {
  return `Email sender is not configured. Add SMTP_PASS for ${smtpUser || defaultSenderEmail} in the .env file.`;
}

function isMailConfigured() {
  return Boolean(smtpUser && smtpPass && smtpFrom);
}

function getTransporter() {
  if (!isMailConfigured()) {
    throw new Error(getMailConfigurationMessage());
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return transporter;
}

async function verifyTransporterReady() {
  if (!verifyPromise) {
    verifyPromise = getTransporter()
      .verify()
      .then(() => undefined)
      .catch((error: unknown) => {
        verifyPromise = null;
        throw error;
      });
  }

  await verifyPromise;
}

type SendMailInput = Omit<SendMailOptions, "from"> & {
  fromName?: string;
};

export async function sendMail({ fromName = smtpFromName, ...options }: SendMailInput) {
  await verifyTransporterReady();

  return getTransporter().sendMail({
    from: fromName ? `${fromName} <${smtpFrom}>` : smtpFrom,
    ...options,
  });
}

export function getDefaultMailbox() {
  return smtpUser || smtpFrom || defaultSenderEmail;
}
