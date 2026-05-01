import { transporter } from "./transporter.js";

export async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: '"Ausleihsystem" <noreply@mcs-medien.de>',
    to,
    subject,
    text,
    html,
  });
  console.log("Mail sent:", info.messageId);
  return info;
}
