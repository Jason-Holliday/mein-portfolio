import { mailer } from "../config/mail.js";

export const sendContactMail = async ({ name, email, message }) => {
  return mailer.sendMail({
    from: `"Portfolio Kontakt" <${process.env.MAIL_USER}>`, 
    to: process.env.MAIL_RECEIVER,                         
    replyTo: email,                                       
    subject: `Neue Nachricht von ${name}`,
    text: `
Name: ${name}
Email: ${email}

Nachricht:
${message}
    `,
  });
};
