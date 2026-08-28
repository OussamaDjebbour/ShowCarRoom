import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Plain client-side Vite + React SPA.
// TanStack Router (file-based) generates src/routeTree.gen.ts from src/routes.
// The router plugin must run before the React plugin.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // The connected Supabase integration provides NEXT_PUBLIC_* names. Map only
    // its browser-safe values to Vite's client-exposed env namespace.
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
    },
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
  };
});
