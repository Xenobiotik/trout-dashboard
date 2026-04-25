const fs = require("fs");
const path = require("path");
const { calculateIndex } = require("./indexModel");

const rootDir = path.join(__dirname, "..");
const inputPath = path.join(rootDir, "data", "live-conditions-sample.json");
const outputPath = path.join(rootDir, "data", "live-results-sample.json");

const liveConditions = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const results = {
  metadata: {
    version: "0.1",
    dataType: "live-results-sample",
    modelVersion: liveConditions.metadata?.modelVersion || "0.4",
    generatedAt: new Date().toISOString(),
    source: "data/live-conditions-sample.json"
  },
  regions: Object.fromEntries(
    Object.entries(liveConditions.regions).map(([regionId, region]) => [
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
for (const [regionId, region] of Object.entries(results.regions)) {
  console.log(`${regionId}: ${region.forecast.map((day) => `${day.date}:${day.index}`).join(" ")}`);
}
