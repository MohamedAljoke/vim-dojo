import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "test",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:4173/vim-dojo/" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173/vim-dojo/",
    reuseExistingServer: true,
  },
});
