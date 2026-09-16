import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Personal data lives in secrets/.env (gitignored, never uploaded).
  envDir: "secrets",
});
