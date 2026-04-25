const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const sourcePath = path.join(rootDir, "data", "live-results-sample.json");
const outputPath = path.join(rootDir, "app", "live-data.js");
const data = fs.readFileSync(sourcePath, "utf8");

fs.writeFileSync(outputPath, `window.LIVE_RESULTS = ${data.trim()};\n`);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
