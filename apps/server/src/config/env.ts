export const env = {
  PORT: Number(process.env.PORT) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || "",
};
