import dotenv from "dotenv";
dotenv.config();

// === IMPORTS ===
import express from "express";
import cors from "cors";
import projectsRoutes from "./routes/projectsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { connectDB } from "./config/db.js";
import { auth } from "./betterAuth/auth.js";

// === APP SETUP ===
const app = express();
const PORT = process.env.PORT || 5000;

// === CORS (MUSS GANZ AM ANFANG SEIN!) ===
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://www.jasonholliday.dev",
      "https://jasonholliday.dev",
      "http://localhost:5173",
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// === MIDDLEWARE ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================================================
// 💚 HEALTH CHECK (ganz oben, damit es immer funktioniert)
// =======================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend läuft",
    timestamp: new Date().toISOString(),
  });
});

// =======================================================
// 🔐 BETTER AUTH
// =======================================================
app.use("/api/auth", async (req, res) => {
  try {
    const baseURL = process.env.BETTER_AUTH_URL || `http://localhost:${PORT}`;
    const url = new URL(req.originalUrl, baseURL);

    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
    });

    let body;
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      body = JSON.stringify(req.body);
      headers.set("content-type", "application/json");
    }

    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const webResponse = await auth.handler(webRequest);
    res.status(webResponse.status);

    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = await webResponse.text();

    try {
      res.json(JSON.parse(responseBody));
    } catch {
      res.send(responseBody);
    }
  } catch (error) {
    console.error("❌ Better Auth Fehler:", error);
    res.status(500).json({ error: "Authentifizierungsfehler" });
  }
});

// =======================================================
// 👤 SESSION ENDPOINT
// =======================================================
app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    res.json(session);
  } catch (error) {
    console.error("❌ Session Fehler:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
});

// =======================================================
// 📦 API ROUTES
// =======================================================
app.use("/api/projects", projectsRoutes);
app.use("/api", contactRoutes);

// =======================================================
// 💥 GLOBAL ERROR HANDLER
// =======================================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// =======================================================
// 🚫 404 HANDLER (MUSS GANZ AM ENDE SEIN!)
// =======================================================
app.use((req, res) => {
  res.status(404).json({
    error: "Route nicht gefunden",
    path: req.path,
  });
});

// =======================================================
// 🚀 SERVER START
// =======================================================
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI fehlt in der .env Datei");
    }

    if (!process.env.BETTER_AUTH_SECRET) {
      console.warn(
        "⚠️  BETTER_AUTH_SECRET nicht gesetzt – bitte in Production setzen!"
      );
    }

    await connectDB();
    console.log("✅ MongoDB verbunden");

    app.listen(PORT, () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`✅ Server läuft auf Port ${PORT}`);
      console.log(
        `🌐 Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );
      console.log(`🔐 Better Auth: /api/auth/*`);
      console.log(`💚 Health Check: /api/health`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("❌ Server Start Fehler:", error.message);
    process.exit(1);
  }
};

startServer();