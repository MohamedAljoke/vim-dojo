import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages serves the site from /vim-dojo/.
export default defineConfig({
  base: "/vim-dojo/",
  plugins: [react(), tailwindcss()],
});
