import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

console.log("📧 Mail Config:");
console.log("- Host:", process.env.MAIL_HOST);
console.log("- Port:", process.env.MAIL_PORT);
console.log("- User:", process.env.MAIL_USER);
console.log("- Pass:", process.env.MAIL_PASS ? "✅ Gesetzt" : "❌ FEHLT!");
console.log("- Receiver:", process.env.MAIL_RECEIVER);

export const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"), 
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  family: 4, 
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2' 
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
});

// Verbindung beim Start testen
mailer.verify((error, success) => {
  if (error) {
    console.error("❌ Mail-Server Verbindung fehlgeschlagen!");
    console.error("Error:", error.message);
  } else {
    console.log("✅ Mail-Server bereit für", process.env.MAIL_USER);
  }
});