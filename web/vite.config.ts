import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // La página de metodología importa docs/METODOLOGIA.md, que está fuera de web/.
  server: { fs: { allow: [".."] } },
  // MapLibre pesa ~1 MB y se carga aparte (lazy) solo en la pantalla del mapa.
  build: { chunkSizeWarningLimit: 1100 },
});
