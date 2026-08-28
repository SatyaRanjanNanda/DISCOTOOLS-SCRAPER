const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'downloaded_icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const goldGradientDef = '<defs><linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#C99738" /><stop offset="35%" stop-color="#E7C46E" /><stop offset="47%" stop-color="#FFF08D" /><stop offset="50%" stop-color="#FFFFFF" /><stop offset="53%" stop-color="#FFF08D" /><stop offset="55%" stop-color="#C99738" /><stop offset="100%" stop-color="#E7C46E" /></linearGradient></defs>';

const clientScript = `
(async () => {
  const allExtracted = new Set();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  
  const tabs = Array.from(document.querySelectorAll('li'));
  for (let tab of tabs) {
    if (tab.innerText && tab.innerText.includes('Customise Icons')) {
      tab.click();
      break;
    }
  }
  
  console.log('Extracting icons... Please wait.');
  
  for (let i = 1; i <= 10; i++) {
    await sleep(2500);
    const grid = Array.from(document.querySelectorAll('div')).find(el => el.className && el.className.includes('bg-dark-500 shadow-lg grid'));
    if (!grid) continue;
    
    const svgs = Array.from(grid.querySelectorAll('svg.h-auto'));
    for (const svg of svgs) {
      allExtracted.add({
        html: svg.innerHTML,
        viewBox: svg.getAttribute('viewBox') || '0 0 164 164',
        fill: svg.getAttribute('fill') || ''
      });
    }
    
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim().startsWith('Next'));
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    } else {
      break;
    }
  }
  
  console.log('Sending ' + allExtracted.size + ' icons to server...');
  await fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: JSON.stringify(Array.from(allExtracted))
  });
  console.log('Done! All icons should now be in the downloaded_icons folder.');
})();
`;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(clientScript);
    return;
  }

  if (req.method === 'POST' && req.url === '/upload') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const icons = JSON.parse(body);
        let count = 1;
        for (const ic of icons) {
          const isPinkOne = ic.fill && ic.fill.toUpperCase() === '#FF6BFA';
          
          let svgContent = '';
          if (isPinkOne) {
            svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + ic.viewBox + '" fill="' + ic.fill + '">' + ic.html + '</svg>';
          } else {
            let modifiedHtml = ic.html.replace(/fill="[^"]*"/g, 'fill="url(#gold-gradient)"');
            if (!modifiedHtml.includes('fill="url(#gold-gradient)"')) {
               modifiedHtml = '<g fill="url(#gold-gradient)">' + modifiedHtml + '</g>';
            }
            svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + ic.viewBox + '">' + goldGradientDef + modifiedHtml + '</svg>';
          }
          
          const safeName = 'icon_' + String(count).padStart(3, '0');
          fs.writeFileSync(path.join(outDir, safeName + '.svg'), svgContent);
          count++;
        }
        res.writeHead(200);
        res.end('OK');
        console.log('Successfully saved ' + (count - 1) + ' icons!');
        setTimeout(() => process.exit(0), 1000);
      } catch (e) {
        res.writeHead(500);
        res.end('Error');
      }
    });
  }
});

server.listen(3000, () => {
  console.log('Scraper Server running on http://localhost:3000');
  console.log('To run: node scraper.js');
  console.log('Then paste this in your browser console: fetch("http://localhost:3000/script.js").then(r=>r.text()).then(eval)');
});
