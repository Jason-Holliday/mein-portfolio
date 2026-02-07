import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../betterAuth/auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ 
        error: "Nicht authentifiziert",
        message: "Du musst eingeloggt sein, um auf diese Ressource zuzugreifen."
      });
    }
    req.user = session.user;
    req.session = session;
    next();
  } catch (error) {
    console.error("Auth Middleware Fehler:", error);
    return res.status(401).json({ 
      error: "Ungültige Session",
      message: "Deine Sitzung ist ungültig oder abgelaufen."
    });
  }
};