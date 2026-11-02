// WARNING (demo only): this endpoint is unauthenticated and sends mail to any
// address in the request body. Before any public deployment it must verify the
// Paystack reference server-side with the secret key
// (GET https://api.paystack.co/transaction/verify/:reference) and be
// rate-limited.

import nodemailer from "nodemailer";
import { buildReceiptEmail } from "@/lib/receiptEmail";

export const runtime = "nodejs";

const REQUIRED_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"];
const MAX_ITEMS = 50;
const MAX_STRING = 200;
const ORDER_NUMBER_REGEX = /^FM-\d{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isText = (value, { optional = false } = {}) =>
  typeof value === "string" &&
  value.length <= MAX_STRING &&
  (optional || value.trim().length > 0);

const isAmount = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

// Returns an error message, or null when the order is valid.
function validateOrder(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Body must be a JSON object";
  }

  if (typeof body.orderNumber !== "string" || !ORDER_NUMBER_REGEX.test(body.orderNumber)) {
    return "Invalid orderNumber";
  }

  if (
    typeof body.email !== "string" ||
    body.email.length > MAX_STRING ||
    !EMAIL_REGEX.test(body.email.trim())
  ) {
    return "Invalid email";
  }

  for (const field of ["customerName", "address1", "city", "postalCode", "deliveryTime", "paymentMethod"]) {
    if (!isText(body[field])) {
      return `Invalid ${field}`;
    }
  }

  if (body.address2 !== undefined && !isText(body.address2, { optional: true })) {
    return "Invalid address2";
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > MAX_ITEMS) {
    return `items must be an array of 1-${MAX_ITEMS} entries`;
  }

  for (const item of body.items) {
    if (
      !item ||
      typeof item !== "object" ||
      !isText(item.name) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      !isAmount(item.price)
    ) {
      return "Invalid item";
    }
  }

  for (const field of ["subtotal", "deliveryFee", "tax", "tip", "total"]) {
    if (!isAmount(body[field])) {
      return `Invalid ${field}`;
    }
  }

  return null;
}

export async function POST(request) {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error(
      `send-receipt: email is not configured. Missing env vars: ${missing.join(", ")}`
    );
    return Response.json({ error: "Email service is not configured" }, { status: 503 });
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    console.error("send-receipt: SMTP_PORT is not a valid port number.");
    return Response.json({ error: "Email service is not configured" }, { status: 503 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateOrder(body);

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const order = { ...body, email: body.email.trim() };
  const { subject, html, text } = buildReceiptEmail(order);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: order.email,
      subject,
      html,
      text,
    });

    return Response.json({ ok: true });
  } catch (error) {
    // Log the message only; never log credentials or the transporter config.
    console.error("send-receipt: failed to send receipt email:", error?.message);
    return Response.json({ error: "Failed to send receipt" }, { status: 502 });
  }
}
