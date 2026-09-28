const engine = require("../app/online-engine");
const HOURLY_VARIABLES = ["temperature_2m", "pressure_msl", "precipitation", "cloud_cover", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"];

function buildOpenMeteoUrl(regions, options = {}) {
  const params = new URLSearchParams({
    latitude: regions.map((region) => region.latitude).join(","),
    longitude: regions.map((region) => region.longitude).join(","),
    hourly: HOURLY_VARIABLES.join(","),
    timezone: "Europe/Moscow",
    past_days: String(options.pastDays ?? 4),
    forecast_days: String(options.forecastDays ?? 5),
    wind_speed_unit: "ms",
    precipitation_unit: "mm"
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

function degreesToCompass(degrees) {
  if (!Number.isFinite(degrees)) return null;
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
}

function normalizeOpenMeteoResponse(payload, regions, now = new Date()) {
  const locations = Array.isArray(payload) ? payload : [payload];
  if (locations.length !== regions.length || locations.some((location) => !location?.hourly?.time?.length)) throw new Error("Неполный ответ Open-Meteo по районам");
  return locations.map((location, index) => {
    const region = regions[index];
    const hourly = location.hourly;
    const currentIndex = hourly.time.findIndex((time) => Date.parse(`${time}+03:00`) === Math.floor(now.getTime() / 3600000) * 3600000);
    const value = (key) => Number.isFinite(hourly[key]?.[currentIndex]) ? hourly[key][currentIndex] : null;
    const pressure = value("pressure_msl");
    return {
      regionId: region.id, direction: region.direction, settlement: region.settlement,
      latitude: region.latitude, longitude: region.longitude, timezone: location.timezone, elevation: location.elevation,
      current: {
        time: hourly.time[currentIndex] || null,
        airTemperatureC: value("temperature_2m"), pressureHPa: pressure,
        pressureMmHg: pressure === null ? null : Math.round(pressure * 0.750062),
        precipitationMm: value("precipitation"), cloudCoverPercent: value("cloud_cover"),
        windSpeedMs: value("wind_speed_10m"), windGustsMs: value("wind_gusts_10m"),
        windDirectionDegrees: value("wind_direction_10m"), windDirection: degreesToCompass(value("wind_direction_10m"))
      },
      forecastDays: engine.buildDailyForecast(hourly, now)
    };
  });
}

async function fetchWeatherForRegions(regions, options = {}) {
  const activeRegions = regions.filter((region) => region.active !== false);
  if (activeRegions.some((region) => !Number.isFinite(region.latitude) || !Number.isFinite(region.longitude))) throw new Error("Не заданы координаты района");
  const url = buildOpenMeteoUrl(activeRegions, options);
  const payload = await engine.fetchJson(url);
  const now = new Date();
  return {
    metadata: { source: "open-meteo", generatedAt: now.toISOString(), url, pastDays: options.pastDays ?? 4, forecastDays: options.forecastDays ?? 5, hourlyVariables: HOURLY_VARIABLES },
    regions: normalizeOpenMeteoResponse(payload, activeRegions, now)
  };
}

module.exports = { HOURLY_VARIABLES, buildOpenMeteoUrl, normalizeOpenMeteoResponse, fetchWeatherForRegions, degreesToCompass };
