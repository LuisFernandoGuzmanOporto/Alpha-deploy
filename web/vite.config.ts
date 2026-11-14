import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // La página de metodología importa docs/METODOLOGIA.md, que está fuera de web/.
  server: { fs: { allow: [".."] } },
  // MapLibre pesa ~1 MB y se carga aparte (lazy) solo en la pantalla del mapa.
  build: { chunkSizeWarningLimit: 1100 },
  // Las pruebas de contraste leen styles/tokens.css; el resto del CSS se ignora en las pruebas.
  test: { css: { include: [/tokens\.css/] } },
});
