/**
 * Expo prebuild용 PNG 생성 — 원본: src/assets/images/Logo.svg
 * 실행: npm run generate-icons  (prebuild 전에 자동 실행됨)
 */import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src', 'assets', 'images');
const LOGO_SVG = path.join(SRC_DIR, 'Logo.svg');

const BRAND_BG = '#F0FDFA';
const ADAPTIVE_BG = '#E6F4FE';

const LOGO_VIEW_W = 130;
const LOGO_VIEW_H = 114;

function wrapLogoSvg(size, { background, logoFill, paddingRatio = 0.18 }) {
  const inner = fs
    .readFileSync(LOGO_SVG, 'utf8')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

  const innerWithFill =
    logoFill != null
      ? inner.replace(/fill="#0AB7A6"/g, `fill="${logoFill}"`).replace(/fill='#0AB7A6'/g, `fill="${logoFill}"`)
      : inner;

  const pad = size * paddingRatio;
  const avail = size - pad * 2;
  const scale = Math.min(avail / LOGO_VIEW_W, avail / LOGO_VIEW_H);
  const w = LOGO_VIEW_W * scale;
  const h = LOGO_VIEW_H * scale;
  const tx = (size - w) / 2;
  const ty = (size - h) / 2;

  const bgRect =
    background && background !== 'transparent'
      ? `<rect width="${size}" height="${size}" fill="${background}"/>`
      : '';

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
${bgRect}
<g transform="translate(${tx} ${ty}) scale(${scale})">
${innerWithFill}
</g>
</svg>`;
}

async function loadResvg() {
  try {
    return await import('@resvg/resvg-js');
  } catch {
    console.error(
      'Run: npx --yes -p @resvg/resvg-js node scripts/generate-expo-icons.mjs',
    );
    process.exit(1);
  }
}

function renderPng(svg, width) {
  const { Resvg } = ResvgModule;
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'transparent',
  });
  return resvg.render().asPng();
}

let ResvgModule;

async function writeIcon(name, svg, width) {
  const out = path.join(SRC_DIR, name);
  fs.writeFileSync(out, renderPng(svg, width));
  console.log('wrote', path.relative(ROOT, out));
}

async function main() {
  ResvgModule = await loadResvg();

  await writeIcon(
    'icon.png',
    wrapLogoSvg(1024, { background: BRAND_BG, logoFill: '#0AB7A6' }),
    1024,
  );
  await writeIcon(
    'android-icon-foreground.png',
    wrapLogoSvg(1024, { background: 'transparent', logoFill: '#0AB7A6', paddingRatio: 0.22 }),
    1024,
  );
  await writeIcon(
    'android-icon-monochrome.png',
    wrapLogoSvg(1024, { background: 'transparent', logoFill: '#0D9488', paddingRatio: 0.22 }),
    1024,
  );
  await writeIcon(
    'splash-icon.png',
    wrapLogoSvg(200, { background: 'transparent', logoFill: '#0AB7A6', paddingRatio: 0.12 }),
    200,
  );
  await writeIcon(
    'favicon.png',
    wrapLogoSvg(48, { background: BRAND_BG, logoFill: '#0AB7A6', paddingRatio: 0.1 }),
    48,
  );

  const bgSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="1024" fill="${ADAPTIVE_BG}"/>
</svg>`;
  await writeIcon('android-icon-background.png', bgSvg, 1024);

  console.log('Done — icons generated from src/assets/images/Logo.svg');
}

main();
