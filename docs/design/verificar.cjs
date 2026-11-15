// Ejecutar con Node y Playwright disponible. Requiere Vite en localhost:5173.
const { chromium } = require(process.env.EA_PLAYWRIGHT || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage();
    const results = [];
    await page.goto((process.env.EA_PREVIEW_URL || 'http://127.0.0.1:5173') + '/src/components/ui/preview.html');
    await page.getByRole('heading', { name: 'Explora análogos terrestres' }).waitFor();
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const name of ['Explorador', 'Comparador', 'Ficha', 'Metodología']) {
        await page.getByRole('tab', { name, exact: true }).click();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (overflow) throw new Error(`Desbordamiento: ${width} ${name}`);
        results.push(`${width}px ${name}: sin desbordamiento`);
      }
      await page.getByRole('tab', { name: 'Explorador', exact: true }).click();
      await page.screenshot({ path: path.join(__dirname, `captura-diseno-${width}.png`), fullPage: true });
    }
    await page.getByRole('tab', { name: 'Explorador', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    if (await page.getByRole('tab', { name: 'Comparador', exact: true }).getAttribute('aria-selected') !== 'true') throw new Error('Fallo de teclado');
    results.push('Tabs: flecha derecha cambia selección');
    await page.getByRole('tab', { name: 'Explorador', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Solo Bolivia' }).check();
    await page.getByRole('button', { name: 'Limpiar filtros' }).click();
    if (await page.getByRole('checkbox', { name: 'Solo Bolivia' }).isChecked()) throw new Error('Fallo al limpiar');
    results.push('Filtro de demostración: limpiar restablece estado');
    function lum(hex) { const c = hex.match(/\w\w/g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722; }
    for (const [fg,bg] of [['142d3b','f3f6f4'],['506570','ffffff'],['075e57','e4f2ec'],['ffffff','075e57'],['963e25','fff0e8']]) {
      const a=lum(fg), b=lum(bg), ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      if (ratio<4.5) throw new Error(`Contraste ${fg}/${bg}`);
      results.push(`Contraste #${fg}/#${bg}: ${ratio.toFixed(2)}:1`);
    }
    fs.writeFileSync(path.join(__dirname,'QA-RESULTADOS.md'), '# Verificación de la vista de Noe\n\n'+results.map(r=>'- '+r).join('\n')+'\n\nCapturas de diseño, no de producción. Pendiente revisión con lector de pantalla y QA tras integración de Fernando.\n');
    console.log(results.join('\n'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
