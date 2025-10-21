const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "src/assets/images";
const outputDir = "dist/assets/images";

// Image sizes for responsive images
const sizes = [400, 800, 1200, 1600, 2000];

// Quality settings
const quality = {
  jpeg: 80,
  webp: 75,
  png: 80,
};

async function optimizeImage(
  inputPath,
  outputPath,
  srcOutputPath,
  options = {}
) {
  const { width, format = "webp" } = options;

  let pipeline = sharp(inputPath);

  if (width) {
    pipeline = pipeline.resize(width, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  switch (format) {
    case "webp":
      pipeline = pipeline.webp({ quality: quality.webp });
      break;
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: quality.jpeg });
      break;
    case "png":
      pipeline = pipeline.png({ quality: quality.png });
      break;
  }

  // Save to dist directory
  await pipeline.toFile(outputPath);
  console.log(`✓ Optimized: ${outputPath}`);

  // Also save to src directory for Parcel compatibility
  if (srcOutputPath) {
    await pipeline.clone().toFile(srcOutputPath);
    console.log(`✓ Copied: ${srcOutputPath}`);
  }
}

async function processDirectory(dirPath, relativePath = "", srcOutputDir) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      // Skip icons directory as they're already optimized for PWA
      if (entry.name === "icons") {
        console.log(`⏭️  Skipping icons directory: ${relPath}`);
        continue;
      }
      // Skip optimized directory to prevent infinite loops
      if (entry.name === "optimized") {
        console.log(`⏭️  Skipping optimized directory: ${relPath}`);
        continue;
      }
      await processDirectory(fullPath, relPath, srcOutputDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".gif", ".tiff", ".webp"].includes(ext)) {
        const baseName = path.basename(entry.name, ext);
        const outputBaseDir = path.join(outputDir, path.dirname(relPath));
        const outputBasePath = path.join(outputBaseDir, baseName);

        // Ensure output directory exists
        fs.mkdirSync(outputBaseDir, { recursive: true });
        const srcOutputBaseDir = path.join(srcOutputDir, path.dirname(relPath));
        fs.mkdirSync(srcOutputBaseDir, { recursive: true });

        try {
          // Generate WebP versions in multiple sizes
          for (const size of sizes) {
            const outputPath = `${outputBasePath}-${size}w.webp`;
            const srcOutputPath = path.join(
              srcOutputBaseDir,
              `${baseName}-${size}w.webp`
            );
            await optimizeImage(fullPath, outputPath, srcOutputPath, {
              width: size,
              format: "webp",
            });
          }

          // Generate original size WebP
          const webpPath = `${outputBasePath}.webp`;
          const srcWebpPath = path.join(srcOutputBaseDir, `${baseName}.webp`);
          await optimizeImage(fullPath, webpPath, srcWebpPath, {
            format: "webp",
          });

          // Generate optimized JPEG fallback
          const jpegPath = `${outputBasePath}.jpg`;
          const srcJpegPath = path.join(srcOutputBaseDir, `${baseName}.jpg`);
          await optimizeImage(fullPath, jpegPath, srcJpegPath, {
            format: "jpeg",
          });

          console.log(`✅ Processed: ${relPath}`);
        } catch (error) {
          console.error(`❌ Error processing ${relPath}:`, error.message);
        }
      }
    }
  }
}

async function main() {
  console.log("🚀 Starting image optimization...");

  try {
    // Clean up previous optimized files to prevent duplicates
    const srcOutputDir = "src/assets/images/optimized";
    if (fs.existsSync(srcOutputDir)) {
      fs.rmSync(srcOutputDir, { recursive: true, force: true });
      console.log("🧹 Cleaned up previous optimized files");
    }

    // Ensure output directories exist
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(srcOutputDir, { recursive: true });

    // Process all images
    await processDirectory(inputDir, "", srcOutputDir);

    console.log("🎉 Image optimization complete!");
    console.log("\n📋 Generated formats:");
    console.log("   - WebP (multiple sizes: 400w, 800w, 1200w, 1600w, 2000w)");
    console.log("   - WebP (original size)");
    console.log("   - JPEG (optimized fallback)");
  } catch (error) {
    console.error("❌ Image optimization failed:", error);
    process.exit(1);
  }
}

main();
