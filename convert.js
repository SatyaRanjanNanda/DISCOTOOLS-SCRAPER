const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sharp = require('sharp');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const inputDir = path.join(__dirname, 'downloaded_icons');
const outputDir = path.join(__dirname, 'converted_icons');

if (!fs.existsSync(inputDir)) {
  console.error("❌ The 'downloaded_icons' folder does not exist. Please run the scraper first.");
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.svg'));
if (files.length === 0) {
  console.error("❌ No SVG icons found in the 'downloaded_icons' folder.");
  process.exit(1);
}

console.log(`\n✦ Found ${files.length} SVG icons ready for conversion.`);

rl.question('\n► What format do you want to save them as? (png / jpg / webp): ', (formatStr) => {
  const format = formatStr.trim().toLowerCase();
  
  if (!['png', 'jpg', 'jpeg', 'webp'].includes(format)) {
    console.error("❌ Invalid format. Please run the script again and type 'png', 'jpg', or 'webp'.");
    process.exit(1);
  }

  const finalFormat = format === 'jpg' ? 'jpeg' : format;

  rl.question('► What size (width/height in pixels) do you want the icons? (e.g., 256, 512, 1024) [default: 512]: ', async (sizeStr) => {
    const size = parseInt(sizeStr.trim()) || 512;
    
    console.log(`\n⚙️ Converting ${files.length} icons to ${format.toUpperCase()} (${size}x${size})... Please wait.\n`);
    
    let successCount = 0;
    
    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const fileNameWithoutExt = path.basename(file, '.svg');
      const outputPath = path.join(outputDir, `${fileNameWithoutExt}.${format}`);
      
      try {
        let pipeline = sharp(inputPath).resize(size, size);
        
        // If converting to JPEG, add a white background because JPEG doesn't support transparency
        if (finalFormat === 'jpeg') {
          pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
        }
        
        await pipeline.toFormat(finalFormat).toFile(outputPath);
        successCount++;
        
        // Print progress
        if (successCount % 50 === 0 || successCount === files.length) {
          console.log(`✅ Converted ${successCount}/${files.length} icons...`);
        }
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }
    
    console.log(`\n🎉 All done! Successfully saved ${successCount} icons into the 'converted_icons' folder!`);
    rl.close();
  });
});
