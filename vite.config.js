import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Personal data lives in secrets/.env (gitignored, never uploaded).
  envDir: "secrets",
  server: {
    // In dev, forward API calls to the local server/index.js proxy
    // (run `npm start` inside server/) instead of duplicating its logic here.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
