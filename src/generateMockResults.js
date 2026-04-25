const fs = require("fs");
const path = require("path");
const { calculateIndex } = require("./indexModel");

const rootDir = path.join(__dirname, "..");
const mockPath = path.join(rootDir, "data", "mock-conditions.json");
const outputPath = path.join(rootDir, "data", "mock-results.json");

const mockData = JSON.parse(fs.readFileSync(mockPath, "utf8"));

const results = {
  metadata: {
    version: "0.1",
    dataType: "mock-results",
    modelVersion: mockData.metadata?.modelVersion || "0.4",
    generatedAt: new Date().toISOString(),
    source: "data/mock-conditions.json"
  },
  days: mockData.days,
  regions: Object.fromEntries(
    Object.entries(mockData.regions).map(([regionId, region]) => [
      regionId,
      {
        summary: region.summary,
        forecast: region.forecast.map((day) => ({
          ...calculateIndex(day),
          raw: day.raw
        }))
      }
    ])
  )
};

fs.writeFileSync(outputPath, `${JSON.stringify(results, null, 2)}\n`);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
