import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

// Redis-Verbindung aus Umgebungsvariablen laden
const redis = Redis.fromEnv();

// Rate Limiter erstellen: 100 Requests pro 60 Sekunden
const ratelimit = new Ratelimit({
  redis, 
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true, 
  prefix: "ratelimit", 
});

export default ratelimit;
