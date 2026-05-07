const puppeteer = require('puppeteer');
const path = require('path');

const url = 'file://' + path.resolve(__dirname, 'index.html');

const sections = [
  { id: 'hero',         name: '01-hero' },
  { id: 'stats',        name: '02-stats' },
  { id: 'why',          name: '03-why' },
  { id: 'subjects',     name: '04-subjects' },
  { id: 'how',          name: '05-how-it-works' },
  { id: 'testimonials', name: '06-testimonials' },
  { id: 'cta',          name: '07-cta' },
];

async function shoot(page, label, opts = {}) {
  await page.screenshot({ path: `screenshots/${label}.png`, fullPage: false, ...opts });
  console.log(`  ✓ ${label}.png`);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fs = require('fs');
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  // ── DESKTOP (1440px) ──────────────────────────────────────
  console.log('\nDesktop (1440px):');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Full page
  await page.screenshot({ path: 'screenshots/desktop-full.png', fullPage: true });
  console.log('  ✓ desktop-full.png');

  // Per section
  for (const { id, name } of sections) {
    const el = await page.$(`#${id}`);
    if (!el) { console.log(`  ⚠ #${id} not found`); continue; }
    await el.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await el.screenshot({ path: `screenshots/desktop-${name}.png` });
    console.log(`  ✓ desktop-${name}.png`);
  }

  // ── MOBILE (390px — iPhone 14) ────────────────────────────
  console.log('\nMobile (390px):');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });
  console.log('  ✓ mobile-full.png');

  for (const { id, name } of sections) {
    const el = await page.$(`#${id}`);
    if (!el) continue;
    await el.scrollIntoView();
    await new Promise(r => setTimeout(r, 400));
    await el.screenshot({ path: `screenshots/mobile-${name}.png` });
    console.log(`  ✓ mobile-${name}.png`);
  }

  // ── TABLET (768px — iPad) ─────────────────────────────────
  console.log('\nTablet (768px):');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.screenshot({ path: 'screenshots/tablet-full.png', fullPage: true });
  console.log('  ✓ tablet-full.png');

  await browser.close();
  console.log('\nAll screenshots saved to /screenshots/');
})();
