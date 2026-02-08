/**
 * 📄 Pipeline PDF → WebP — Destino IA
 *
 * Convertit chaque page d'un PDF en images WebP optimisées
 * et génère un slides-manifest.json pour le frontend React.
 *
 * Usage :
 *   npx tsx scripts/pdf-to-webp.ts atelier.pdf
 *   npx tsx scripts/pdf-to-webp.ts atelier.pdf -q 90 -w 2560 -d 250 --clean
 *
 * Dépendances système : ImageMagick + Ghostscript
 * Dépendances Node    : sharp, tsx
 */

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync, execFileSync } from 'child_process';

// ─── Types ─────────────────────────────────────────────────────

interface CliOptions {
  pdfPath: string;
  quality: number;
  maxWidth: number;
  dpi: number;
  clean: boolean;
  outputDir: string;
}

interface SlideInfo {
  index: number;
  file: string;
  size: number;
  width: number;
  height: number;
}

interface SlideManifest {
  version: string;
  generatedAt: string;
  source: string;
  settings: {
    quality: number;
    maxWidth: number;
    dpi: number;
  };
  slides: SlideInfo[];
  totalSlides: number;
  totalSize: number;
}

// ─── Windows: configurer Ghostscript pour ImageMagick ──────────

function configureGhostscript(): void {
  if (process.platform !== 'win32') return;
  if (process.env['MAGICK_GHOSTSCRIPT_PATH']) return;

  const searchPaths = [
    'C:\\Program Files\\gs',
    'C:\\Program Files (x86)\\gs',
  ];

  for (const base of searchPaths) {
    try {
      const dirs = require('fs').readdirSync(base) as string[];
      for (const dir of dirs) {
        const binPath = path.join(base, dir, 'bin');
        const gsExe = path.join(binPath, 'gswin64c.exe');
        if (require('fs').existsSync(gsExe)) {
          process.env['MAGICK_GHOSTSCRIPT_PATH'] = binPath;
          // Also add to PATH
          process.env['PATH'] = `${binPath};${process.env['PATH'] ?? ''}`;
          return;
        }
      }
    } catch { /* ignore */ }
  }
}

configureGhostscript();

// ─── CLI Parsing ───────────────────────────────────────────────

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📄 PDF → WebP Converter — Destino IA

Usage:
  npx tsx scripts/pdf-to-webp.ts <fichier.pdf> [options]

Options:
  -q, --quality <n>    Qualité WebP (1-100, défaut: 85)
  -w, --width <n>      Largeur max en pixels (défaut: 1920)
  -d, --dpi <n>        DPI de rendu (défaut: 200)
  -o, --output <dir>   Dossier de sortie (défaut: public/slides)
  --clean              Vider le dossier de sortie avant conversion
  -h, --help           Afficher cette aide

Exemples:
  npm run slides -- atelier.pdf
  npm run slides:clean -- atelier.pdf
  npm run slides:hq -- atelier.pdf
    `);
    process.exit(0);
  }

  let pdfPath = '';
  let quality = 85;
  let maxWidth = 1920;
  let dpi = 200;
  let clean = false;
  let outputDir = path.join(process.cwd(), 'public', 'slides');

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    switch (arg) {
      case '-q':
      case '--quality':
        quality = parseInt(args[++i] ?? '85', 10);
        break;
      case '-w':
      case '--width':
        maxWidth = parseInt(args[++i] ?? '1920', 10);
        break;
      case '-d':
      case '--dpi':
        dpi = parseInt(args[++i] ?? '200', 10);
        break;
      case '-o':
      case '--output':
        outputDir = path.resolve(args[++i] ?? 'public/slides');
        break;
      case '--clean':
        clean = true;
        break;
      default:
        if (!arg.startsWith('-') && !pdfPath) {
          pdfPath = path.resolve(arg);
        }
        break;
    }
  }

  if (!pdfPath) {
    console.error('❌ Aucun fichier PDF spécifié.');
    console.log('💡 Usage: npx tsx scripts/pdf-to-webp.ts <fichier.pdf>');
    process.exit(1);
  }

  return { pdfPath, quality, maxWidth, dpi, clean, outputDir };
}

// ─── Utilitaires ───────────────────────────────────────────────

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function cleanDir(dir: string): Promise<void> {
  try {
    const files = await fs.readdir(dir);
    let removed = 0;
    for (const file of files) {
      if (file.endsWith('.webp') || file.endsWith('.png') || file === 'slides-manifest.json') {
        await fs.unlink(path.join(dir, file));
        removed++;
      }
    }
    if (removed > 0) {
      console.log(`🧹 ${removed} fichier(s) supprimé(s) dans ${path.basename(dir)}/`);
    }
  } catch {
    // dossier n'existe pas encore
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function elapsed(startMs: number): string {
  const s = ((Date.now() - startMs) / 1000).toFixed(1);
  return `${s}s`;
}

// ─── Vérification des dépendances système ──────────────────────

function checkSystemDeps(): void {
  // Vérifier ImageMagick
  let hasIM = false;
  try {
    execSync('magick --version', { stdio: 'pipe' });
    hasIM = true;
  } catch { /* not found */ }

  if (!hasIM) {
    console.error(`
❌ ImageMagick requis mais non trouvé !

  Installation :
    winget install ImageMagick.ImageMagick
  
  Puis redémarre ton terminal.
`);
    process.exit(1);
  }

  // Vérifier Ghostscript
  let hasGS = false;
  for (const cmd of ['gswin64c --version', 'gswin32c --version', 'gs --version']) {
    try {
      execSync(cmd, { stdio: 'pipe' });
      hasGS = true;
      break;
    } catch { /* not found */ }
  }

  if (!hasGS) {
    console.error(`
❌ Ghostscript requis mais non trouvé !

  Ghostscript est nécessaire pour lire les fichiers PDF.

  Télécharge-le : https://ghostscript.com/releases/gsdnld.html
  Puis ajoute le dossier bin/ au PATH et redémarre ton terminal.
`);
    process.exit(1);
  }

  console.log('✅ Dépendances système OK (ImageMagick + Ghostscript)');
}

// ─── Comptage des pages ────────────────────────────────────────

function countPages(pdfPath: string): number {
  try {
    const output = execFileSync('magick', ['identify', '-density', '72', pdfPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024,
    }).toString();
    return output.trim().split('\n').length;
  } catch {
    throw new Error('Impossible de lire le PDF avec ImageMagick. Vérifie que Ghostscript est bien installé.');
  }
}

// ─── Conversion d'une page PDF → PNG via ImageMagick ───────────

function convertPageToPng(
  pdfPath: string,
  pageIndex: number,
  outputPng: string,
  dpi: number,
  maxWidth: number
): void {
  // ImageMagick utilise des index 0-based : [0] = page 1
  const input = `${pdfPath}[${pageIndex}]`;

  execFileSync('magick', [
    '-density', dpi.toString(),
    input,
    '-resize', `${maxWidth}x>`,
    '-flatten',
    '-quality', '100',
    outputPng,
  ], {
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024,
    timeout: 60000, // 60s par page max
  });
}

// ─── Conversion PNG → WebP via Sharp ───────────────────────────

async function convertPngToWebP(
  pngPath: string,
  webpPath: string,
  quality: number,
  maxWidth: number
): Promise<{ size: number; width: number; height: number }> {
  const webpBuffer = await sharp(pngPath)
    .resize(maxWidth, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  const metadata = await sharp(webpBuffer).metadata();

  await fs.writeFile(webpPath, webpBuffer);

  return {
    size: webpBuffer.length,
    width: metadata.width ?? maxWidth,
    height: metadata.height ?? 0,
  };
}

// ─── Pipeline principal ────────────────────────────────────────

async function convertPdfToWebP(options: CliOptions): Promise<SlideInfo[]> {
  const { pdfPath, quality, maxWidth, dpi, outputDir } = options;

  console.log(`📄 Lecture du PDF: ${path.basename(pdfPath)}`);
  console.log(`⚙️  Paramètres: qualité=${quality}, largeur=${maxWidth}px, DPI=${dpi}\n`);

  // Compter les pages
  console.log('🔄 Comptage des pages...');
  const totalPages = countPages(pdfPath);
  console.log(`✅ ${totalPages} page(s) détectées\n`);
  console.log(`🖼️  Conversion en WebP (qualité: ${quality}%)...`);

  const slides: SlideInfo[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const slideNumber = pageNum.toString().padStart(3, '0');
    const webpFilename = `slide-${slideNumber}.webp`;
    const pngTempPath = path.join(outputDir, `temp-${slideNumber}.png`);
    const webpPath = path.join(outputDir, webpFilename);

    try {
      // 1. PDF page → PNG (via ImageMagick)
      convertPageToPng(pdfPath, pageNum - 1, pngTempPath, dpi, maxWidth);

      // 2. PNG → WebP (via Sharp)
      const { size, width, height } = await convertPngToWebP(
        pngTempPath, webpPath, quality, maxWidth
      );

      // 3. Supprimer le PNG temporaire
      try { await fs.unlink(pngTempPath); } catch { /* ignore */ }

      slides.push({
        index: pageNum,
        file: webpFilename,
        size,
        width,
        height,
      });

      const sizeStr = formatBytes(size);
      const dimStr = `${width}×${height}`;
      const progress = `[${pageNum}/${totalPages}]`;
      console.log(`  ✓ ${progress} ${webpFilename}  ${dimStr}  ${sizeStr}`);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠️  Page ${pageNum} ignorée: ${msg}`);
      // Nettoyer le PNG temp si présent
      try { await fs.unlink(pngTempPath); } catch { /* ignore */ }
    }
  }

  return slides;
}

// ─── Nettoyage des fichiers temporaires restants ───────────────

async function cleanupTempFiles(outputDir: string): Promise<void> {
  try {
    const files = await fs.readdir(outputDir);
    const tempFiles = files.filter(f => f.startsWith('temp-') && f.endsWith('.png'));
    for (const file of tempFiles) {
      await fs.unlink(path.join(outputDir, file));
    }
    if (tempFiles.length > 0) {
      console.log(`🧹 ${tempFiles.length} fichier(s) temporaire(s) nettoyé(s)`);
    }
  } catch { /* ignore */ }
}

// ─── Génération du Manifest ────────────────────────────────────

async function generateManifest(
  options: CliOptions,
  slides: SlideInfo[]
): Promise<void> {
  const totalSize = slides.reduce((sum, s) => sum + s.size, 0);

  const manifest: SlideManifest = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    source: path.basename(options.pdfPath),
    settings: {
      quality: options.quality,
      maxWidth: options.maxWidth,
      dpi: options.dpi,
    },
    slides,
    totalSlides: slides.length,
    totalSize,
  };

  const manifestPath = path.join(options.outputDir, 'slides-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n📋 Manifest généré: ${path.relative(process.cwd(), manifestPath)}`);
}

// ─── Main ──────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startTime = Date.now();

  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   📄 PDF → WebP Pipeline — Destino IA       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // 1. Parser les arguments
  const options = parseArgs(process.argv);

  // 2. Vérifier le PDF
  try {
    const stat = await fs.stat(options.pdfPath);
    if (stat.isDirectory()) {
      console.error(`❌ "${options.pdfPath}" est un dossier, pas un fichier PDF.`);
      console.log('💡 Spécifie le chemin complet vers le fichier .pdf');
      process.exit(1);
    }
  } catch {
    console.error(`❌ Fichier introuvable: ${options.pdfPath}`);
    console.log('💡 Vérifie le chemin du fichier PDF');
    process.exit(1);
  }

  const pdfStats = await fs.stat(options.pdfPath);
  console.log(`📁 PDF: ${path.basename(options.pdfPath)} (${formatBytes(pdfStats.size)})`);

  // 3. Vérifier les dépendances système
  checkSystemDeps();

  // 4. Préparer le dossier de sortie
  await ensureDir(options.outputDir);
  if (options.clean) {
    await cleanDir(options.outputDir);
  }

  // 5. Convertir
  const slides = await convertPdfToWebP(options);

  if (slides.length === 0) {
    console.error('\n❌ Aucun slide converti. Vérifie le PDF et les dépendances.');
    process.exit(1);
  }

  // 6. Nettoyer les fichiers temporaires
  await cleanupTempFiles(options.outputDir);

  // 7. Générer le manifest
  await generateManifest(options, slides);

  // 8. Résumé final
  const totalSize = slides.reduce((sum, s) => sum + s.size, 0);
  const avgSize = Math.round(totalSize / slides.length);
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ✅ Conversion terminée avec succès !       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log(`  📊 Slides   : ${slides.length}`);
  console.log(`  💾 Taille   : ${formatBytes(totalSize)}`);
  console.log(`  📏 Moyenne  : ${formatBytes(avgSize)} / slide`);
  console.log(`  ⏱️  Durée    : ${elapsed(startTime)}`);
  console.log(`  📂 Sortie   : ${path.relative(process.cwd(), options.outputDir)}/`);
  console.log('');
}

// Exécution
main().catch((error: Error) => {
  console.error('\n💥 Erreur fatale:', error.message);
  process.exit(1);
});
