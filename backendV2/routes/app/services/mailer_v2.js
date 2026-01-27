import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export function sendMail(username, message) {
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
    const mailText = `Neue Kontaktanfrage im Ausleihsystem.\n\nBenutzername: ${username}\n\nNachricht:\n${message}`;

    const mailHtml = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <title>Neue Nachricht im Ausleihsystem</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
    <h2>Neue Nachricht im Ausleihsystem</h2>
    <p><strong>Benutzername:</strong> ${username}</p>
    <p><strong>Nachricht:</strong></p>
    <p style="white-space: pre-line;">${message}</p>
  </body>
</html>`;

    const info = await transporter.sendMail({
      from: '"Ausleihsystem" <noreply@mcs-medien.de>',
      to: process.env.MAIL_SENDEES_CONTACT,
      subject: "Sie haben eine neue Nachricht!",
      text: mailText,
      html: mailHtml,
    });

    // debugging logs
    // console.log("Message sent:", info.messageId);
  })();
  // console.log("sendMailLoan called");
}
