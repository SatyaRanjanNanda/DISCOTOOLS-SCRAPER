const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'downloaded_icons');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));

// This script finds any old gradient in the downloaded SVGs and replaces it with a new one.
// You can change `newGradient` to whatever SVG gradient you prefer.
const oldGradientRegex = /<defs><linearGradient id="gold-gradient"[^>]*>.*?<\/linearGradient><\/defs>/;
const newGradient = '<defs><linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#C99738" /><stop offset="35%" stop-color="#E7C46E" /><stop offset="47%" stop-color="#FFF08D" /><stop offset="50%" stop-color="#FFFFFF" /><stop offset="53%" stop-color="#FFF08D" /><stop offset="55%" stop-color="#C99738" /><stop offset="100%" stop-color="#E7C46E" /></linearGradient></defs>';

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (oldGradientRegex.test(content)) {
    content = content.replace(oldGradientRegex, newGradient);
    fs.writeFileSync(filePath, content);
    updatedCount++;
  }
}

console.log(`Successfully updated the gradient in ${updatedCount} files.`);
