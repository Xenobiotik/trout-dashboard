const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const sourcePath = path.join(rootDir, "data", "mock-results.json");
const outputPath = path.join(rootDir, "app", "mock-data.js");
const data = fs.readFileSync(sourcePath, "utf8");

fs.writeFileSync(
  outputPath,
  `window.MOCK_RESULTS = ${data.trim()};\n`
);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
