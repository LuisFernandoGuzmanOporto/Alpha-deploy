# Web de Earth Analogs

Aplicación estática (Vite, React, TypeScript estricto). Solo lee JSON de `web/public/data/`.

## Desarrollo

```bash
cd web
npm install
npm run data:demo   # genera web/public/data/ con los datos de DEMOSTRACIÓN (inventados)
npm run dev
```

`npm run data:demo` es solo para probar la interfaz. Los datos reales los genera y commitea Sebastián con `python pipeline/similarity.py`; no subas los datos de demostración.

## Producción

`npm run build` genera `dist/`. Vercel: carpeta raíz `web`, comando `npm run build`, salida `dist` (ver `vercel.json`).

## Rutas

- `/` selector de sitio y ranking
- `/comparar/:siteId/:candidateId` comparador
- `/metodologia` metodología
