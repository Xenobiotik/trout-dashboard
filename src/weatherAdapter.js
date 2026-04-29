const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const HOURLY_VARIABLES = [
  "temperature_2m",
  "pressure_msl",
  "precipitation",
  "cloud_cover",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m"
];

function buildOpenMeteoUrl(regions, options = {}) {
  const params = new URLSearchParams({
    latitude: regions.map((region) => region.latitude).join(","),
    longitude: regions.map((region) => region.longitude).join(","),
    hourly: HOURLY_VARIABLES.join(","),
    timezone: options.timezone || "Europe/Moscow",
    past_days: String(options.pastDays ?? 3),
    forecast_days: String(options.forecastDays ?? 5),
    wind_speed_unit: "ms",
    precipitation_unit: "mm"
  });

  return `${OPEN_METEO_FORECAST_URL}?${params.toString()}`;
}

function normalizeOpenMeteoResponse(payload, regions) {
  const locations = Array.isArray(payload) ? payload : [payload];

  return locations.map((location, index) => {
    const region = regions[index];
    const hourly = location.hourly || {};
    const currentIndex = findCurrentHourIndex(hourly.time || []);
    const forecastDays = buildDailyForecast(hourly);

    return {
      regionId: region.id,
      direction: region.direction,
      settlement: region.settlement,
      latitude: region.latitude,
      longitude: region.longitude,
      timezone: location.timezone,
      elevation: location.elevation,
      current: buildHourSnapshot(hourly, currentIndex),
      forecastDays
    };
  });
}

function findCurrentHourIndex(times) {
  if (!times.length) return -1;

  const now = Date.now();
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const timestamp = new Date(time).getTime();
    const distance = Math.abs(timestamp - now);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function buildHourSnapshot(hourly, index) {
  if (index < 0) return null;

  const pressureHPa = valueAt(hourly.pressure_msl, index);
  const windDirectionDegrees = valueAt(hourly.wind_direction_10m, index);

  return {
    time: valueAt(hourly.time, index),
    airTemperatureC: valueAt(hourly.temperature_2m, index),
    pressureHPa,
    pressureMmHg: pressureHPa == null ? null : Math.round(pressureHPa * 0.750062),
    precipitationMm: valueAt(hourly.precipitation, index),
    cloudCoverPercent: valueAt(hourly.cloud_cover, index),
    windSpeedMs: valueAt(hourly.wind_speed_10m, index),
    windGustsMs: valueAt(hourly.wind_gusts_10m, index),
    windDirectionDegrees,
    windDirection: degreesToCompass(windDirectionDegrees)
  };
}

function buildDailyForecast(hourly) {
  const dayMap = new Map();
  const times = hourly.time || [];

  times.forEach((time, index) => {
    const date = time.slice(0, 10);
    const bucket = dayMap.get(date) || {
      date,
      hours: [],
      temperatureValues: [],
      pressureValues: [],
      precipitationValues: [],
      cloudValues: [],
      windSpeedValues: [],
      windDirectionValues: [],
      windGustValues: []
    };

    bucket.hours.push(time);
    pushValue(bucket.temperatureValues, hourly.temperature_2m, index);
    pushValue(bucket.pressureValues, hourly.pressure_msl, index);
    pushValue(bucket.precipitationValues, hourly.precipitation, index);
    pushValue(bucket.cloudValues, hourly.cloud_cover, index);
    pushValue(bucket.windSpeedValues, hourly.wind_speed_10m, index);
    pushValue(bucket.windDirectionValues, hourly.wind_direction_10m, index);
    pushValue(bucket.windGustValues, hourly.wind_gusts_10m, index);
    dayMap.set(date, bucket);
  });

  const days = [...dayMap.values()].map((bucket) => {
    const meanPressure = average(bucket.pressureValues);
    const meanWindDirection = circularMeanDegrees(bucket.windDirectionValues);

    return {
      date: bucket.date,
      temperatureMeanC: round(average(bucket.temperatureValues)),
      temperatureMinC: round(Math.min(...bucket.temperatureValues)),
      temperatureMaxC: round(Math.max(...bucket.temperatureValues)),
      pressureMeanHPa: round(meanPressure),
      pressureMeanMmHg: meanPressure == null ? null : Math.round(meanPressure * 0.750062),
      precipitationSumMm: round(sum(bucket.precipitationValues)),
      cloudCoverMeanPercent: Math.round(average(bucket.cloudValues)),
      windSpeedMeanMs: round(average(bucket.windSpeedValues)),
      windGustMaxMs: round(Math.max(...bucket.windGustValues)),
      windDirection: degreesToCompass(meanWindDirection),
      windDirectionDegrees: meanWindDirection == null ? null : Math.round(meanWindDirection)
    };
  });

  return days.map((day, index) => {
    const previousDay = days[index - 1];
    const previous3Days = days.slice(Math.max(0, index - 3), index);
    const pressureTrend = calculatePressureTrendStats(days, index);

    return {
      ...day,
      pressureChange24hHPa: previousDay ? round(day.pressureMeanHPa - previousDay.pressureMeanHPa) : null,
      pressureChange24hMmHg: previousDay ? round((day.pressureMeanHPa - previousDay.pressureMeanHPa) * 0.750062) : null,
      pressureAmplitude72hMmHg: pressureTrend.amplitudeMmHg,
      pressureNetChange72hMmHg: pressureTrend.netChangeMmHg,
      pressureDirectionChanges72h: pressureTrend.directionChanges,
      pressureTrendKind: pressureTrend.kind,
      temperatureChange24hC: previousDay ? round(day.temperatureMeanC - previousDay.temperatureMeanC) : null,
      precipitation24hMm: day.precipitationSumMm,
      precipitation72hMm: round(day.precipitationSumMm + sum(previous3Days.map((item) => item.precipitationSumMm || 0)))
    };
  });
}

function calculatePressureTrendStats(days, index) {
  const window = days.slice(Math.max(0, index - 3), index + 1);
  const values = window
    .map((day) => day.pressureMeanMmHg)
    .filter((value) => typeof value === "number" && Number.isFinite(value));

  if (values.length < 2) {
    return { amplitudeMmHg: 0, netChangeMmHg: 0, directionChanges: 0, kind: "unknown" };
  }

  const amplitudeMmHg = Math.round(Math.max(...values) - Math.min(...values));
  const netChangeMmHg = Math.round(values[values.length - 1] - values[0]);
  const signs = [];

  for (let i = 1; i < values.length; i += 1) {
    const delta = values[i] - values[i - 1];
    if (Math.abs(delta) >= 2) {
      signs.push(Math.sign(delta));
    }
  }

  let directionChanges = 0;
  for (let i = 1; i < signs.length; i += 1) {
    if (signs[i] !== signs[i - 1]) directionChanges += 1;
  }

  let kind = "directional";
  if (amplitudeMmHg <= 2) kind = "stable";
  else if (directionChanges >= 2 && amplitudeMmHg >= 10) kind = "strong_saw";
  else if (directionChanges >= 2 && amplitudeMmHg >= 6) kind = "saw";
  else if (directionChanges >= 1 && amplitudeMmHg >= 3) kind = "unstable";

  return { amplitudeMmHg, netChangeMmHg, directionChanges, kind };
}

function valueAt(values, index) {
  if (!Array.isArray(values)) return null;
  return values[index] ?? null;
}

function pushValue(target, values, index) {
  const value = valueAt(values, index);
  if (typeof value === "number" && Number.isFinite(value)) {
    target.push(value);
  }
}

function sum(values) {
  return values.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
}

function average(values) {
  if (!values.length) return null;
  return sum(values) / values.length;
}

function round(value, digits = 1) {
  if (value == null || !Number.isFinite(value)) return null;
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function degreesToCompass(degrees) {
  if (degrees == null || !Number.isFinite(degrees)) return null;
  const normalized = ((degrees % 360) + 360) % 360;
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(normalized / 45) % directions.length;
  return directions[index];
}

function circularMeanDegrees(degreesList) {
  if (!degreesList.length) return null;

  const radians = degreesList.map((degrees) => (degrees * Math.PI) / 180);
  const sin = average(radians.map(Math.sin));
  const cos = average(radians.map(Math.cos));

  if (sin == null || cos == null) return null;
  const degrees = (Math.atan2(sin, cos) * 180) / Math.PI;
  return ((degrees % 360) + 360) % 360;
}

async function fetchWeatherForRegions(regions, options = {}) {
  const activeRegions = regions.filter((region) => region.active !== false);
  const missingCoordinates = activeRegions.filter(
    (region) => typeof region.latitude !== "number" || typeof region.longitude !== "number"
  );

  if (missingCoordinates.length) {
    throw new Error(`Missing coordinates for regions: ${missingCoordinates.map((region) => region.id).join(", ")}`);
  }

  const url = buildOpenMeteoUrl(activeRegions, options);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  return {
    metadata: {
      source: "open-meteo",
      generatedAt: new Date().toISOString(),
      url,
      pastDays: options.pastDays ?? 3,
      forecastDays: options.forecastDays ?? 5,
      hourlyVariables: HOURLY_VARIABLES
    },
    regions: normalizeOpenMeteoResponse(payload, activeRegions)
  };
}

module.exports = {
  HOURLY_VARIABLES,
  buildOpenMeteoUrl,
  normalizeOpenMeteoResponse,
  fetchWeatherForRegions,
  degreesToCompass
};
