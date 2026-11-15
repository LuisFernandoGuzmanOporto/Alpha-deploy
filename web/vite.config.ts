import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vitest/config";

const OG_IMAGE_PATH = "/og-image.jpg";

/**
 * Open Graph y Twitter piden la imagen con URL absoluta. En Vercel se usa el dominio de producción
 * (VERCEL_PROJECT_PRODUCTION_URL); en local queda la ruta relativa.
 */
function ogImageUrl(mode: string): Plugin {
  // loadEnv incluye las variables del entorno del proceso que empiezan con el prefijo dado.
  const host = loadEnv(mode, ".", "VERCEL_").VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const url = host ? `https://${host.replace(/^https?:\/\//, "").replace(/\/+$/, "")}${OG_IMAGE_PATH}` : OG_IMAGE_PATH;
  return {
    name: "og-image-url",
    transformIndexHtml: (html) => html.replaceAll("%OG_IMAGE%", url),
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), ogImageUrl(mode)],
  // La página de metodología importa docs/METODOLOGIA.md, que está fuera de web/.
  server: { fs: { allow: [".."] } },
  // MapLibre pesa ~1 MB y se carga aparte (lazy) solo en la pantalla del mapa.
  build: { chunkSizeWarningLimit: 1100 },
  // Las pruebas de contraste leen styles/tokens.css; el resto del CSS se ignora en las pruebas.
  test: { css: { include: [/tokens\.css/] } },
}));
