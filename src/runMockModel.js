const fs = require("fs");
const path = require("path");
const { calculateIndex } = require("./indexModel");

const rootDir = path.join(__dirname, "..");
const mockPath = path.join(rootDir, "data", "mock-conditions.json");
const mockData = JSON.parse(fs.readFileSync(mockPath, "utf8"));

for (const [regionId, region] of Object.entries(mockData.regions)) {
  console.log(`\n${regionId}: ${region.summary}`);

  for (const day of region.forecast) {
    const result = calculateIndex(day);
    const positive = result.positiveDrivers.map((driver) => driver.factor).join(", ") || "нет";
    const negative = result.negativeDrivers.map((driver) => driver.factor).join(", ") || "нет";
    const warnings = result.warnings.length ? ` | warnings: ${result.warnings.join("; ")}` : "";

    console.log(
      `  ${day.date}: ${result.index} (${result.rating}) raw=${result.indexRaw} +[${positive}] -[${negative}]${warnings}`
    );
  }
}
