export function contactMail({ username, message }) {
  const brand = process.env.MAIL_BRAND_COLOR || "#0ea5e9";

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Neue Nachricht</title>
</head>
<body style="margin:0;padding:0;background:#f2f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Neue Kontaktanfrage im Ausleihsystem.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f2f4f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:${brand};padding:32px 30px 28px;">
              <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;">Neue Nachricht</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">Eine neue Kontaktanfrage ist eingegangen.</p>
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:3px;line-height:3px;font-size:1px;background:${brand};">&nbsp;</td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background:#ffffff;padding:28px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafbfc;border:1px solid #f3f4f6;border-radius:10px;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f3f4f6;">
                    Benutzername
                  </td>
                  <td style="padding:14px 16px;font-weight:600;color:#111827;font-size:14px;vertical-align:top;border-bottom:1px solid #f3f4f6;">
                    ${username || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">
                    Nachricht
                  </td>
                  <td style="padding:14px 16px;font-weight:600;color:#111827;font-size:14px;vertical-align:top;white-space:pre-line;">
                    ${message || "N/A"}
                  </td>
                </tr>
              </table>
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

  const text = `Neue Kontaktanfrage\n\nBenutzername: ${username}\nNachricht:\n${message}`;

  return { html, text };
}
