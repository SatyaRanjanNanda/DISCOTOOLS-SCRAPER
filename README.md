<div align="center">

# ✦ DISCOTOOLS SCRAPER ✦

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" />
</p>

**A powerful, zero-dependency browser injection script to automatically extract and colorize all 311+ Discord role icons from [DiscoTools.xyz](https://discotools.xyz) while completely bypassing Cloudflare bot protection.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-how-to-use) • [Customization](#-customizing-gradients)

</div>

---

## // FEATURES

► **100% Bot-Protection Bypass**: Runs directly inside your browser console, bypassing any Cloudflare or CAPTCHA restrictions.  
► **Auto-Colorization**: Instantly injects beautiful, highly-polished metallic gold gradients into all standard SVGs.  
► **Smart Detection**: Automatically identifies and preserves the original colors of special Discord Server Boost icons.  
► **Fully Automated**: Clicks through all pagination limits automatically to download the entire library in seconds.  
► **Standalone Gradient Updater**: Update the colors of your downloaded icons instantly without re-scraping the site.  

---

## // INSTALLATION

Since this tool uses standard browser APIs and native Node.js, there are **no external dependencies** to install.

1. Clone or download this repository.
2. Ensure you have [Node.js](https://nodejs.org/) installed on your system.
3. You're ready to go.

---

## // HOW TO USE

### Step 1: Start the Local Receiver
The scraper needs a local server to receive the SVG data from your browser and save it to your hard drive. 
Open your terminal in this project folder and run:
```bash
node scraper.js
```
*You should see a message saying: `Scraper Server running on http://localhost:3000`*

### Step 2: Run the Browser Injection
1. Open your web browser and navigate to [DiscoTools Icons Editor](https://discotools.xyz/icons-editor).
2. Open the **Developer Tools Console** (`F12` or `Ctrl+Shift+I` ➔ **Console**).
3. Paste the following one-liner and hit **Enter**:
   ```javascript
   fetch("http://localhost:3000/script.js").then(r=>r.text()).then(eval)
   ```

### Step 3: Execution
The script will take over from here. It will:
- Automatically switch to the "Customise Icons" tab.
- Render all the icons in the grid.
- Navigate through all 4 pages to extract every single SVG (311+ icons).
- Send them securely to your local server, where they will be dynamically colored and saved in the `downloaded_icons/` folder.

---

## // CUSTOMIZING GRADIENTS

You can apply a brand new gradient to your locally downloaded icons in milliseconds without running the scraper again.

1. Open `update_gradient.js` in your code editor.
2. Locate the `newGradient` variable (around line 9).
3. Replace the SVG `<linearGradient>` with your own custom colors. (The default is a stunning 3D metallic gold shine).
4. Run the updater script:
   ```bash
   node update_gradient.js
   ```
   
**Success:** All 300+ non-pink icons in your `downloaded_icons` folder will instantly receive your new gradient effect. 

---

<div align="center">
  <i>Created for Discord Server Enthusiasts</i>
</div>
