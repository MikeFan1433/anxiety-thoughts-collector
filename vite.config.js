import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Project Pages lives at https://<user>.github.io/<repo>/
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
});
