import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const formatDateTime = (value) => {
  if (value == null) return "N/A";

  const toOut = (d) => {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "N/A";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${hh}:${mi} Uhr`;
  };

  if (value instanceof Date) return toOut(value);
  if (typeof value === "number") return toOut(new Date(value));

  const s = String(value).trim();

  // Direct pattern: "YYYY-MM-DD[ T]HH:mm[:ss]"
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?/);
  if (m) {
    const [, y, M, d, h, min] = m;
    return `${d}.${M}.${y} ${h}:${min} Uhr`;
  }

  // ISO or other parseable formats
  const dObj = new Date(s);
  if (!isNaN(dObj.getTime())) return toOut(dObj);

  return "N/A";
};

function buildLoanEmail({ user, items, startDate, endDate, createdDate }) {
  const brand = process.env.MAIL_BRAND_COLOR || "#0ea5e9";
  const itemsList =
    Array.isArray(items) && items.length
      ? `<ul style="margin:4px 0 0 18px; padding:0;">${items
          .map(
            (i) =>
              `<li style="margin:2px 0; color:#111827; line-height:1.3;">${i}</li>`
          )
          .join("")}</ul>`
      : "<span style='color:#111827;'>N/A</span>";

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    :root { color-scheme: light; supported-color-schemes: light; }
    body { margin:0; padding:0; }
    /* Mobile stacking */
    @media (max-width:480px) {
      .outer { width:100% !important; }
      .pad-sm { padding:16px !important; }
      .w-label { width:120px !important; }
    }
    /* Dark-mode override safety */
    @media (prefers-color-scheme: dark) {
      body, table, td, p, a, h1, h2, h3 { background:#ffffff !important; color:#111827 !important; }
      .brand-header { background:${brand} !important; color:#ffffff !important; }
      a { color:${brand} !important; }
    }
  </style>
</head>
<body bgcolor="#ffffff" style="background:#ffffff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; color:#111827; -webkit-text-size-adjust:100%;">
  <!-- Preheader (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    Neue Ausleihe erstellt – Übersicht der Buchung.
  </div>
  <div role="article" aria-roledescription="email" lang="de" style="padding:24px; background:#f2f4f7;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="outer" style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <tr>
        <td class="brand-header" style="padding:22px 26px; background:${brand}; color:#ffffff;">
          <h1 style="margin:0; font-size:18px; line-height:1.35; font-weight:600;">Neue Ausleihe erstellt</h1>
        </td>
      </tr>
      <tr>
        <td class="pad-sm" style="padding:24px 26px; color:#111827;">
          <p style="margin:0 0 14px 0; line-height:1.4;">Es wurde eine neue Ausleihe angelegt. Hier sind die Details:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:14px; line-height:1.3; background:#fcfcfd; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;">
            <tbody>
              <tr>
                <td class="w-label" style="padding:10px 14px; color:#6b7280; width:170px; border-bottom:1px solid #ececec;">Benutzer</td>
                <td style="padding:10px 14px; font-weight:600; border-bottom:1px solid #ececec; color:#111827;">${
                  user || "N/A"
                }</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; color:#6b7280; vertical-align:top; border-bottom:1px solid #ececec;">Ausgeliehene Gegenstände</td>
                <td style="padding:10px 14px; font-weight:600; border-bottom:1px solid #ececec; color:#111827;">${itemsList}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; color:#6b7280; border-bottom:1px solid #ececec;">Startdatum</td>
                <td style="padding:10px 14px; font-weight:600; border-bottom:1px solid #ececec; color:#111827;">${formatDateTime(
                  startDate
                )}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; color:#6b7280; border-bottom:1px solid #ececec;">Enddatum</td>
                <td style="padding:10px 14px; font-weight:600; border-bottom:1px solid #ececec; color:#111827;">${formatDateTime(
                  endDate
                )}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; color:#6b7280;">Erstellt am</td>
                <td style="padding:10px 14px; font-weight:600; color:#111827;">${formatDateTime(
                  createdDate
                )}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin:22px 0 0 0; font-size:14px;">
            <a href="https://admin.insta.the1s.de/api" style="display:inline-block; background:${brand}; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; font-size:14px;" target="_blank" rel="noopener noreferrer">
              Übersicht öffnen
            </a>
          </p>
          <p style="margin:18px 0 0 0; font-size:12px; color:#6b7280; line-height:1.4;">
            Diese E-Mail wurde automatisch vom Ausleihsystem gesendet. Bitte nicht antworten.
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function buildLoanEmailText({ user, items, startDate, endDate, createdDate }) {
  const itemsText =
    Array.isArray(items) && items.length ? items.join(", ") : "N/A";
  return [
    "Neue Ausleihe erstellt",
    "",
    `Benutzer: ${user || "N/A"}`,
    `Gegenstände: ${itemsText}`,
    `Start: ${formatDateTime(startDate)}`,
    `Ende: ${formatDateTime(endDate)}`,
    `Erstellt am: ${formatDateTime(createdDate)}`,
  ].join("\n");
}

export function sendMailLoan(user, items, startDate, endDate, createdDate) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: '"Ausleihsystem" <noreply@mcs-medien.de>',
      to: process.env.MAIL_SENDEES,
      subject: "Eine neue Ausleihe wurde erstellt!",
      text: buildLoanEmailText({
        user,
        items,
        startDate,
        endDate,
        createdDate,
      }),
      html: buildLoanEmail({ user, items, startDate, endDate, createdDate }),
    });

    // debugging logs
    // console.log("Message sent:", info.messageId);
  })();
  // console.log("sendMailLoan called");
}
