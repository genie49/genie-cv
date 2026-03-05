export const env = {
  PORT: Number(process.env.PORT) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  XAI_API_KEY: process.env.XAI_API_KEY || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
};
