const fs = require("fs");
const path = require("path");
const { fetchWeatherForRegions } = require("./weatherAdapter");

async function main() {
  const rootDir = path.join(__dirname, "..");
  const regionsPath = path.join(rootDir, "data", "regions.json");
  const outputPath = path.join(rootDir, "data", "live-weather-sample.json");
  const regions = JSON.parse(fs.readFileSync(regionsPath, "utf8"));

  const snapshot = await fetchWeatherForRegions(regions, {
    pastDays: 3,
    forecastDays: 5,
    timezone: "Europe/Moscow"
  });

  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(`Generated ${path.relative(rootDir, outputPath)}`);
  for (const region of snapshot.regions) {
    const current = region.current;
    console.log(
      `${region.regionId}: ${current.airTemperatureC}°C, ${current.pressureMmHg} мм, ${current.windDirection} ${current.windSpeedMs} м/с, облачность ${current.cloudCoverPercent}%`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
