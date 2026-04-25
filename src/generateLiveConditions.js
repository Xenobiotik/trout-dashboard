const fs = require("fs");
const path = require("path");
const { buildConditionsFromWeather } = require("./conditionsBuilder");

const rootDir = path.join(__dirname, "..");
const inputPath = path.join(rootDir, "data", "live-weather-sample.json");
const outputPath = path.join(rootDir, "data", "live-conditions-sample.json");

const weatherSnapshot = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const conditions = buildConditionsFromWeather(weatherSnapshot);

fs.writeFileSync(outputPath, `${JSON.stringify(conditions, null, 2)}\n`);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
for (const [regionId, region] of Object.entries(conditions.regions)) {
  const first = region.forecast[0];
  console.log(
    `${regionId}: water=${first.raw.estimatedWaterTemperatureC}°C, pressure=${first.raw.pressureMmHg} мм, clarity=${first.raw.waterClarity}, weatherChange=${first.factorScores.weatherChange}`
  );
}
