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

// === MIDDLEWARE ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      'https://www.jasonholliday.dev',
      'https://jasonholliday.dev',
      'http://localhost:5173'
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// === BETTER AUTH ROUTES ===
app.use("/api/auth", async (req, res) => {
  try {
    const baseURL = process.env.BETTER_AUTH_URL || `http://localhost:${PORT}`;
    const url = new URL(req.originalUrl || req.url, baseURL);
    
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
    });

    // Body nur bei POST/PUT/PATCH
    let body = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      body = JSON.stringify(req.body);
      headers.set('content-type', 'application/json');
    }

    const webRequest = new Request(url, {
      method: req.method,
      headers: headers,
      body: body,
    });

    const webResponse = await auth.handler(webRequest);
    res.status(webResponse.status);
    
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    const responseBody = await webResponse.text();
    
    try {
      const jsonBody = JSON.parse(responseBody);
      res.json(jsonBody);
    } catch {
      res.send(responseBody);
    }
  } catch (error) {
    console.error("❌ Better Auth Fehler:", error);
    res.status(500).json({ 
      error: "Authentifizierungsfehler",
      message: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});
// === SESSION ENDPOINT ===
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

// === API ROUTES ===
app.use("/api/projects", projectsRoutes);
app.use("/api", contactRoutes);

// === HEALTH CHECK ===
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Backend läuft",
    timestamp: new Date().toISOString()
  });
});

// === 404 HANDLER ===
app.use((req, res, next) => {
  res.status(404).json({ 
    error: "Route nicht gefunden",
    path: req.path 
  });
});

// === GLOBAL ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// === SERVER START ===
const startServer = async () => {
  try {
    // SICHERHEITSCHECK
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI fehlt in der .env Datei");
    }
    if (!process.env.BETTER_AUTH_SECRET) {
      console.warn("⚠️  BETTER_AUTH_SECRET nicht gesetzt - verwende einen sicheren Wert in Production!");
    }

    // MongoDB Verbindung
    await connectDB();
    console.log("✅ MongoDB verbunden");

    // Server starten
    app.listen(PORT, () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`✅ Server läuft auf Port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
      console.log(`🔐 Better Auth: http://localhost:${PORT}/api/auth/`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("❌ Server Start Fehler:", error.message);
    process.exit(1);
  }
};

startServer();