import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const font = (await readFile('public/fonts/VuturiSans-VariableFont_wght.ttf')).toString('base64');

const cards = [
  {
    file: 'home.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Di masa depan setiap', 'Entrepreneur akan transisi', 'menjadi Digital Entrepreneur.'],
    footer: 'Rio Gunawan — 2016',
  },
  {
    file: 'apa-itu-digital-entrepreneur.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Apa Itu', 'Digital Entrepreneur'],
    footer: 'digitalentrepreneur.co.id',
  },
  {
    file: 'apa-itu-digital-gold-rush.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Digital Gold Rush'],
    footer: 'digitalentrepreneur.co.id',
  },
  {
    file: 'bagaimana-digital-entrepreneur-indonesia-terbentuk.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Bagaimana Digital', 'Entrepreneur Indonesia', 'terbentuk'],
    footer: 'digitalentrepreneur.co.id',
  },
  {
    file: 'filosofi-ideologi-digital-entrepreneur.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Filosofi dan Ideologi', 'Digital Entrepreneur'],
    footer: 'digitalentrepreneur.co.id',
  },
  {
    file: 'bagaimana-memulai-bisnis-digital.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Bagaimana Memulai', 'Bisnis Digital'],
    footer: 'digitalentrepreneur.co.id',
  },
  {
    file: 'siapa-itu-rio-gunawan.jpg',
    kicker: 'Digital Entrepreneur',
    lines: ['Siapa itu', 'Rio Gunawan?'],
    footer: 'digitalentrepreneur.co.id',
  },
];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function cardSvg(card) {
  const title = card.lines
    .map((line, index) => {
      const y = 250 + index * 78;
      return `<text x="80" y="${y}" font-size="68" font-weight="700">${escapeXml(line)}</text>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: "Vuturi Sans";
        src: url("data:font/ttf;base64,${font}") format("truetype");
        font-weight: 100 900;
      }
      text { font-family: "Vuturi Sans", sans-serif; fill: #000; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="#fff"/>
  <rect x="80" y="88" width="72" height="4" fill="#000"/>
  <text x="80" y="150" font-size="22" font-weight="500" letter-spacing="1.5">${escapeXml(card.kicker)}</text>
  ${title}
  <text x="80" y="560" font-size="22" font-weight="400">${escapeXml(card.footer)}</text>
</svg>`;
}

await mkdir('public/og', { recursive: true });

for (const card of cards) {
  const png = await sharp(Buffer.from(cardSvg(card))).png().toBuffer();
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(`public/og/${card.file}`);
  console.log(card.file);
}
