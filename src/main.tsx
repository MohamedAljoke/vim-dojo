import "./styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { App } from "./app";
import { CheatsheetPage } from "./pages/cheatsheet-page";
import { LevelPage } from "./pages/level-page";
import { MapPage } from "./pages/map-page";

// Hash routing: GitHub Pages has no SPA fallback, so /level/2-3 would 404 on reload.
const router = createHashRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <MapPage /> },
      { path: "level/:id", element: <LevelPage /> },
      { path: "cheatsheet", element: <CheatsheetPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
