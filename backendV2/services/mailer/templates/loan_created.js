const formatDateTime = (value) => {
  if (value == null) return "N/A";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "N/A";
  return (
    d.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " Uhr"
  );
};

export function loanMail(user, items, startDate, endDate, createdDate, note) {
  const brand = process.env.MAIL_BRAND_COLOR || "#0ea5e9";

  const itemsHtml =
    Array.isArray(items) && items.length
      ? items
          .map(
            (i) =>
              `<span style="display:inline-block;background:#f0f9ff;color:#0369a1;padding:4px 12px;margin:2px 4px 2px 0;border-radius:20px;font-size:13px;font-weight:500;">${i}</span>`,
          )
          .join(" ")
      : '<span style="color:#9ca3af;">Keine Gegenst&auml;nde</span>';

  const row = (label, value, isLast = false) => `
    <tr>
      <td style="padding:14px 16px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;${isLast ? "" : "border-bottom:1px solid #f3f4f6;"}">
        ${label}
      </td>
      <td style="padding:14px 16px;font-weight:600;color:#111827;font-size:14px;vertical-align:top;${isLast ? "" : "border-bottom:1px solid #f3f4f6;"}">
        ${value}
      </td>
    </tr>`;

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Neue Ausleihe</title>
</head>
<body style="margin:0;padding:0;background:#f2f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Neue Ausleihe erstellt – Details zur Buchung.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f2f4f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:${brand};padding:32px 30px 28px;">
              <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;">Neue Ausleihe</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">Es wurde soeben eine neue Ausleihe im System angelegt.</p>
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="background:#ffffff;padding:0;height:3px;line-height:3px;font-size:1px;background:${brand};">&nbsp;</td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="background:#ffffff;padding:28px 30px 10px;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;">Details zur Ausleihe</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafbfc;border:1px solid #f3f4f6;border-radius:10px;border-collapse:collapse;">
                ${row("Benutzer", user || "N/A")}
                ${row("Gegenst&auml;nde", itemsHtml)}
                ${row("Startdatum", formatDateTime(startDate))}
                ${row("Enddatum", formatDateTime(endDate))}
                ${row("Erstellt am", formatDateTime(createdDate))}
                ${row("Notiz", note || '<span style="color:#9ca3af;">Keine Notiz</span>', true)}
              </table>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td style="background:#ffffff;padding:20px 30px 32px;" align="center">
              <a href="https://admin.insta.the1s.de/api" target="_blank" rel="noopener noreferrer"
                 style="display:inline-block;background:${brand};color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:600;font-size:15px;">
                Ausleihe ansehen &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                Diese E-Mail wurde automatisch vom Ausleihsystem gesendet.<br>
                Bitte antworten Sie nicht auf diese Nachricht.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const itemsText = Array.isArray(items) ? items.join(", ") : "N/A";
  const text = [
    "Neue Ausleihe erstellt",
    "-".repeat(30),
    `Benutzer:      ${user || "N/A"}`,
    `Gegenstaende:  ${itemsText}`,
    `Start:         ${formatDateTime(startDate)}`,
    `Ende:          ${formatDateTime(endDate)}`,
    `Erstellt:      ${formatDateTime(createdDate)}`,
    `Notiz:         ${note || "Keine Notiz"}`,
    "",
    "-> https://admin.insta.the1s.de/api",
  ].join("\n");

  return { html, text };
}
