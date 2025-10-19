import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../assets/icon.svg');
const outputDir = join(__dirname, '../assets');

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  const svgBuffer = readFileSync(svgPath);

  console.log('🎨 Generando íconos...\n');

  for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✅ icon-${size}.png generado`);
  }

  console.log('\n🎉 Todos los íconos generados exitosamente!');
}

generateIcons().catch(console.error);
