import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Plain client-side Vite + React SPA.
// TanStack Router (file-based) generates src/routeTree.gen.ts from src/routes.
// The router plugin must run before the React plugin.
export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  // Ensure a single copy of React across deps (framer-motion, TanStack, etc.)
  // to avoid "Invalid hook call / multiple copies of React".
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
    tsconfigPaths: true,
  },
  server: {
    port: 8080,
  },
});
