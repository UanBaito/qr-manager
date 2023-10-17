import "dotenv/config";

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? `https://qr-manager-two.vercel.app`
    : "http://localhost:3000";
