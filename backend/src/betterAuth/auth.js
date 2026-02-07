import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { mailer } from "../config/mail.js";
import 'dotenv/config';

let dbInstance = null;
const client = new MongoClient(process.env.MONGO_URI);

async function connectMongoDB() {
  if (!dbInstance) {
    await client.connect();
    console.log("✅ MongoDB für Better Auth verbunden");
    dbInstance = client.db("projectDB");
  }
  return dbInstance;
}

const db = await connectMongoDB();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // Diese Funktion wird automatisch von forgetPassword aufgerufen
    sendResetPassword: async ({ user, url, token }) => {
      try {
        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await mailer.sendMail({
          from: `"Dein Projekt" <${process.env.MAIL_USER}>`,
          to: user.email,
          subject: "Passwort zurücksetzen",
          html: `
            <h2>Passwort zurücksetzen</h2>
            <p>Hallo ${user.name || 'Nutzer'},</p>
            <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
            <p><a href="${resetURL}" style="padding: 10px 20px; background: #7c3aed; color: white; text-decoration: none; border-radius: 5px;">Passwort zurücksetzen</a></p>
            <p>Oder kopiere diesen Link: ${resetURL}</p>
            <p><small>Dieser Link ist 1 Stunde gültig.</small></p>
          `,
        });
        console.log("✅ Reset-Mail gesendet an:", user.email);
      } catch (err) {
        console.error("❌ Fehler beim Senden der Reset-Mail:", err);
        throw err;
      }
    },
  },
  
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
  secret: process.env.BETTER_AUTH_SECRET,
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 Tage
    updateAge: 60 * 60 * 24, // Update alle 24h
  },
  
  cookies: {
    sessionToken: {
      name: "better-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      },
    },
  },
});