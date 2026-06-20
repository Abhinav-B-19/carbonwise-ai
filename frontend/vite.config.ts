import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components": "/src/components",
      "@/pages": "/src/pages",
      "@/services": "/src/services",
      "@/hooks": "/src/hooks",
      "@/utils": "/src/utils",
      "@/types": "/src/types",
      "@/api": "/src/api",
    },
  },
});
