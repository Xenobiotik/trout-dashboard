const WATER_CLARITY_LABELS = {
  crystal_clear: "кристально прозрачная",
  clear: "прозрачная",
  slightly_tea_clear: "слегка чайная прозрачная",
  slightly_colored_clear: "слегка окрашенная прозрачная",
  moderately_muddy: "умеренно мутная",
  strongly_muddy: "сильно мутная"
};

function buildConditionsFromWeather(weatherSnapshot) {
  return {
    metadata: {
      version: "0.1",
      dataType: "live-conditions",
      modelVersion: "0.4",
      generatedAt: new Date().toISOString(),
      source: weatherSnapshot.metadata?.source || "weather-snapshot",
      weatherGeneratedAt: weatherSnapshot.metadata?.generatedAt || null,
      notes: "Weather-derived conditions. Water temperature, clarity and water level are proxy estimates."
    },
    regions: Object.fromEntries(
      weatherSnapshot.regions.map((region) => [
        region.regionId,
        {
          summary: `${region.direction}: ${region.settlement}. Реальные погодные данные, гидрология рассчитана косвенно.`,
          forecast: region.forecastDays
            .map((day, index, days) => buildDayConditions(region, day, index, days))
            .filter((day) => isTodayOrFuture(day.date))
            .slice(0, 5)
        }
      ])
    )
  };
}

function buildDayConditions(region, day, index, forecastDays) {
  const estimatedWaterTemperatureC = estimateWaterTemperature(day, forecastDays, index);
  const waterClarity = estimateWaterClarity(day);
  const waterLevel = estimateWaterLevel(day);
  const pressureChange24hHPa = day.pressureChange24hHPa ?? 0;
  const pressureTrend = calculatePressureTrendStats(forecastDays, index);
  const temperatureChange24hC = day.temperatureChange24hC ?? 0;
  const windDirection = day.windDirection;
  const previousWindDirection = forecastDays[index - 1]?.windDirection;
  const previousWindSpeedMs = forecastDays[index - 1]?.windSpeedMeanMs;
  const windDirectionChangeDegrees = previousWindDirection ? compassShiftDegrees(previousWindDirection, windDirection) : null;
  const windSpeedChange24hMs =
    typeof previousWindSpeedMs === "number" && typeof day.windSpeedMeanMs === "number"
      ? round(day.windSpeedMeanMs - previousWindSpeedMs)
      : null;

  const raw = {
    estimatedWaterTemperatureC,
    airTemperatureC: day.temperatureMeanC,
    pressureHPa: day.pressureMeanHPa,
    pressureMmHg: day.pressureMeanMmHg,
    pressureChange24hHPa,
    pressureChange24hMmHg: day.pressureChange24hMmHg ?? round(pressureChange24hHPa * 0.750062),
    pressureAmplitude72hMmHg: day.pressureAmplitude72hMmHg ?? pressureTrend.amplitudeMmHg,
    pressureNetChange72hMmHg: day.pressureNetChange72hMmHg ?? pressureTrend.netChangeMmHg,
    pressureDirectionChanges72h: day.pressureDirectionChanges72h ?? pressureTrend.directionChanges,
    pressureTrendKind: day.pressureTrendKind || pressureTrend.kind,
    temperatureChange24hC,
    precipitation24hMm: day.precipitation24hMm,
    precipitation72hMm: day.precipitation72hMm,
    cloudCoverPercent: day.cloudCoverMeanPercent,
    windDirection,
    windDirectionDegrees: day.windDirectionDegrees,
    windSpeedMs: day.windSpeedMeanMs,
    windGustsMs: day.windGustMaxMs,
    waterClarity,
    waterClarityLabel: WATER_CLARITY_LABELS[waterClarity],
    waterLevel,
    windDirectionPrevious: previousWindDirection || null,
    windDirectionChangeDegrees,
    windSpeedChange24hMs,
    moonPhase: "unknown"
  };

  const factorScores = {
    waterTemperature: scoreWaterTemperature(estimatedWaterTemperatureC),
    season: scoreSeason(day.date, estimatedWaterTemperatureC),
    weatherChange: scoreWeatherChange({
      pressureChange24hHPa,
      pressureChange24hMmHg: raw.pressureChange24hMmHg,
      pressureAmplitude72hMmHg: raw.pressureAmplitude72hMmHg,
      pressureNetChange72hMmHg: raw.pressureNetChange72hMmHg,
      pressureDirectionChanges72h: raw.pressureDirectionChanges72h,
      pressureTrendKind: raw.pressureTrendKind,
      temperatureChange24hC,
      windDirection,
      previousWindDirection,
      windSpeedChange24hMs,
      windGustsMs: day.windGustMaxMs,
      precipitation24hMm: day.precipitation24hMm
    }),
    pressure: scorePressure(day.pressureMeanHPa),
    waterClarity: scoreWaterClarity(waterClarity),
    light: scoreLight(day.cloudCoverMeanPercent, day.date, estimatedWaterTemperatureC),
    wind: scoreWind(day.windDirection, day.windSpeedMeanMs),
    waterLevel: scoreWaterLevel(waterLevel),
    moon: 55
  };

  const flags = buildFlags(raw, factorScores);
  const caps = buildCaps(raw);

  return {
    date: day.date,
    confidence: getConfidence(raw),
    raw,
    factorScores,
    caps,
    flags
  };
}

function estimateWaterTemperature(day, days, index) {
  const current = day.temperatureMeanC ?? day.temperatureMaxC ?? 0;
  const previous = days.slice(Math.max(0, index - 3), index).map((item) => item.temperatureMeanC);
  const values = [current, ...previous].filter((value) => typeof value === "number");
  const smoothedAir = average(values);
  const month = new Date(`${day.date}T12:00:00`).getMonth() + 1;
  const seasonal = getSeasonalWaterTemperatureProfile(month);

  const airInfluence = (smoothedAir - seasonal.referenceAirC) * seasonal.airWeight;
  const currentInfluence = ((day.temperatureMaxC ?? current) - seasonal.referenceAirC) * seasonal.currentAirWeight;
  const estimated = seasonal.baseC + airInfluence + currentInfluence;

  return round(clamp(estimated, seasonal.minC, seasonal.maxC));
}

function getSeasonalWaterTemperatureProfile(month) {
  const profiles = {
    1: { baseC: 3.2, minC: 2.5, maxC: 4.5, referenceAirC: -4, airWeight: 0.08, currentAirWeight: 0.03 },
    2: { baseC: 3.0, minC: 2.5, maxC: 4.5, referenceAirC: -4, airWeight: 0.08, currentAirWeight: 0.03 },
    3: { baseC: 4.8, minC: 3.5, maxC: 6.5, referenceAirC: 0, airWeight: 0.12, currentAirWeight: 0.05 },
    4: { baseC: 7.0, minC: 5.8, maxC: 10.0, referenceAirC: 5, airWeight: 0.18, currentAirWeight: 0.07 },
    5: { baseC: 10.0, minC: 7.5, maxC: 14.0, referenceAirC: 11, airWeight: 0.26, currentAirWeight: 0.10 },
    6: { baseC: 13.5, minC: 9.0, maxC: 17.0, referenceAirC: 16, airWeight: 0.30, currentAirWeight: 0.12 },
    7: { baseC: 15.5, minC: 10.0, maxC: 20.5, referenceAirC: 18, airWeight: 0.34, currentAirWeight: 0.14 },
    8: { baseC: 15.0, minC: 10.0, maxC: 20.0, referenceAirC: 17, airWeight: 0.32, currentAirWeight: 0.12 },
    9: { baseC: 12.0, minC: 8.0, maxC: 16.5, referenceAirC: 12, airWeight: 0.24, currentAirWeight: 0.08 },
    10: { baseC: 8.0, minC: 5.0, maxC: 12.0, referenceAirC: 7, airWeight: 0.20, currentAirWeight: 0.06 },
    11: { baseC: 5.0, minC: 3.5, maxC: 8.0, referenceAirC: 2, airWeight: 0.14, currentAirWeight: 0.04 },
    12: { baseC: 3.5, minC: 2.5, maxC: 5.5, referenceAirC: -2, airWeight: 0.10, currentAirWeight: 0.03 }
  };

  return profiles[month] || profiles[4];
}

function estimateWaterClarity(day) {
  const p24 = day.precipitation24hMm ?? 0;
  const p72 = day.precipitation72hMm ?? 0;

  if (p24 >= 20 || p72 >= 40) return "strongly_muddy";
  if (p24 >= 9 || p72 >= 25) return "moderately_muddy";
  if (p24 >= 3 || p72 >= 10) return "slightly_colored_clear";
  if (p24 > 0 || p72 > 0) return "slightly_tea_clear";
  return "clear";
}

function estimateWaterLevel(day) {
  const p24 = day.precipitation24hMm ?? 0;
  const p72 = day.precipitation72hMm ?? 0;

  if (p24 >= 25 || p72 >= 50) return "flood_risk";
  if (p24 >= 15 || p72 >= 35) return "high";
  if (p24 >= 6 || p72 >= 18) return "slightly_high";
  if (p72 <= 1) return "slightly_low";
  return "normal";
}

function calculatePressureTrendStats(days, index) {
  const values = days
    .slice(Math.max(0, index - 3), index + 1)
    .map((item) => item.pressureMeanMmHg)
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

function scoreWaterTemperature(temp) {
  if (temp <= 2) return 20;
  if (temp <= 5) return interpolate(temp, 3, 5, 30, 50);
  if (temp <= 9) return interpolate(temp, 6, 9, 60, 80);
  if (temp <= 15) return 98;
  if (temp <= 17) return interpolate(temp, 16, 17, 88, 75);
  if (temp <= 19) return interpolate(temp, 18, 19, 60, 35);
  return 20;
}

function scoreSeason(date, estimatedWaterTemperatureC) {
  const month = new Date(`${date}T12:00:00`).getMonth() + 1;

  if (month <= 2 || month === 12) return 20;
  if (month === 3) return 30;
  if (month === 4) return estimatedWaterTemperatureC >= 6 ? 55 : 42;
  if (month === 5) return 86;
  if (month === 6) return 92;
  if (month === 7) return estimatedWaterTemperatureC >= 18 ? 55 : 78;
  if (month === 8) return estimatedWaterTemperatureC >= 18 ? 58 : 82;
  if (month === 9) return 92;
  if (month === 10) return 78;
  if (month === 11) return 40;
  return 50;
}

function scoreWeatherChange({
  pressureChange24hHPa,
  pressureChange24hMmHg,
  pressureAmplitude72hMmHg,
  pressureDirectionChanges72h,
  pressureTrendKind,
  temperatureChange24hC,
  windDirection,
  previousWindDirection,
  windSpeedChange24hMs,
  windGustsMs,
  precipitation24hMm
}) {
  const pressureChangeMmHg =
    typeof pressureChange24hMmHg === "number"
      ? pressureChange24hMmHg
      : (pressureChange24hHPa ?? 0) * 0.750062;
  const tempChange = Math.abs(temperatureChange24hC ?? 0);
  const windShift = previousWindDirection ? compassShiftDegrees(previousWindDirection, windDirection) : 0;
  const amplitude = pressureAmplitude72hMmHg ?? 0;
  const directionChanges = pressureDirectionChanges72h ?? 0;
  let pressureTrendScore = 92;
  let stabilityScore = 88;
  let windScore = 100;
  let temperatureScore = 92;
  let precipitationScore = 88;

  if (Math.abs(pressureChangeMmHg) <= 1) pressureTrendScore = 98;
  else if (pressureChangeMmHg < -1 && pressureChangeMmHg >= -4) pressureTrendScore = 100;
  else if (pressureChangeMmHg < -4 && pressureChangeMmHg >= -7) pressureTrendScore = 72;
  else if (pressureChangeMmHg < -7) pressureTrendScore = 52;
  else if (pressureChangeMmHg > 1 && pressureChangeMmHg <= 4) pressureTrendScore = 76;
  else if (pressureChangeMmHg > 4 && pressureChangeMmHg <= 7) pressureTrendScore = 50;
  else if (pressureChangeMmHg > 7) pressureTrendScore = 28;

  if (amplitude <= 2) stabilityScore = 98;
  else if (pressureTrendKind === "strong_saw" || (directionChanges >= 2 && amplitude >= 10)) stabilityScore = 25;
  else if (pressureTrendKind === "saw" || (directionChanges >= 2 && amplitude >= 6)) stabilityScore = 45;
  else if (pressureTrendKind === "unstable" || (directionChanges >= 1 && amplitude >= 3)) stabilityScore = 72;
  else if (amplitude >= 10) stabilityScore = 50;
  else if (amplitude >= 6) stabilityScore = 68;

  if (windShift >= 135) windScore -= 30;
  else if (windShift >= 90) windScore -= 18;
  const windSpeedChange = Math.abs(windSpeedChange24hMs ?? 0);
  if (windSpeedChange >= 6) windScore -= 24;
  else if (windSpeedChange >= 4) windScore -= 16;
  else if (windSpeedChange >= 2.5) windScore -= 8;
  if ((windGustsMs ?? 0) >= 14) windScore -= 12;

  if (tempChange >= 10) temperatureScore = 25;
  else if (tempChange >= 7) temperatureScore = 40;
  else if (tempChange >= 5) temperatureScore = 60;
  else if (tempChange >= 3) temperatureScore = 75;

  if ((precipitation24hMm ?? 0) >= 25) precipitationScore = 30;
  else if ((precipitation24hMm ?? 0) >= 15) precipitationScore = 42;
  else if ((precipitation24hMm ?? 0) >= 9) precipitationScore = 62;
  else if ((precipitation24hMm ?? 0) >= 3) precipitationScore = 78;

  const score =
    pressureTrendScore * 0.4 +
    stabilityScore * 0.2 +
    clamp(windScore, 0, 100) * 0.2 +
    temperatureScore * 0.1 +
    precipitationScore * 0.1;

  return Math.round(clamp(score, 0, 100));
}

function scorePressure(pressureHPa) {
  if (pressureHPa == null) return 55;
  const pressureMmHg = pressureHPa * 0.750062;

  if (pressureMmHg < 730) return 45;
  if (pressureMmHg < 735) return interpolate(pressureMmHg, 730, 734, 60, 72);
  if (pressureMmHg < 742) return interpolate(pressureMmHg, 735, 741, 75, 88);
  if (pressureMmHg <= 758) return interpolate(pressureMmHg, 742, 758, 90, 100);
  if (pressureMmHg <= 765) return interpolate(pressureMmHg, 759, 765, 88, 76);
  if (pressureMmHg <= 772) return interpolate(pressureMmHg, 766, 772, 75, 60);
  if (pressureMmHg <= 780) return interpolate(pressureMmHg, 773, 780, 58, 45);
  return 40;
}

function scoreWaterClarity(clarity) {
  const scores = {
    crystal_clear: 78,
    clear: 88,
    slightly_tea_clear: 95,
    slightly_colored_clear: 84,
    moderately_muddy: 52,
    strongly_muddy: 22
  };

  return scores[clarity] ?? 60;
}

function scoreLight(cloudCoverPercent, date, estimatedWaterTemperatureC) {
  const month = new Date(`${date}T12:00:00`).getMonth() + 1;
  const cloud = cloudCoverPercent ?? 50;

  if (cloud >= 45 && cloud <= 90) return 92;
  if (cloud > 90) return 78;
  if (cloud < 25) {
    if (month <= 4 || estimatedWaterTemperatureC <= 6) return 74;
    if (month >= 7 && month <= 8) return 45;
    return 58;
  }

  return 74;
}

function scoreWind(direction, speedMs) {
  const directionScore = {
    S: 92,
    SW: 96,
    W: 94,
    NW: 66,
    SE: 62,
    N: 48,
    NE: 36,
    E: 34
  }[direction] ?? 65;

  let speedScore = 75;
  if (speedMs <= 1) speedScore = 65;
  else if (speedMs <= 4) speedScore = 95;
  else if (speedMs <= 7) speedScore = 72;
  else if (speedMs <= 10) speedScore = 48;
  else speedScore = 22;

  return Math.round(directionScore * 0.6 + speedScore * 0.4);
}

function scoreWaterLevel(level) {
  const scores = {
    normal: 90,
    slightly_low: 82,
    low: 70,
    critically_low: 35,
    slightly_high: 82,
    high: 48,
    flood_risk: 18
  };

  return scores[level] ?? 75;
}

function buildFlags(raw, factorScores) {
  const flags = [];

  if (factorScores.weatherChange >= 75) flags.push("stable_weather");
  if (Math.abs(raw.pressureChange24hMmHg ?? 0) <= 1 && (raw.pressureAmplitude72hMmHg ?? 0) <= 2) flags.push("stable_pressure");
  if ((raw.pressureChange24hMmHg ?? 0) <= -1 && (raw.pressureChange24hMmHg ?? 0) >= -4) flags.push("smooth_pressure_fall");
  if ((raw.pressureChange24hMmHg ?? 0) <= -7) flags.push("sharp_pressure_drop");
  if ((raw.pressureChange24hMmHg ?? 0) >= 7) flags.push("sharp_pressure_rise");
  if (raw.pressureTrendKind === "saw" || raw.pressureTrendKind === "strong_saw") flags.push("pressure_saw");
  if ((raw.pressureChange24hMmHg ?? 0) < -1 && raw.cloudCoverPercent >= 60) flags.push("prefrontal_window");
  if ((raw.pressureMmHg ?? 0) >= 766 && raw.cloudCoverPercent < 30) flags.push("anticyclone_clear");
  if ((raw.windDirectionChangeDegrees ?? 0) >= 90) flags.push("wind_direction_shift");
  if (Math.abs(raw.windSpeedChange24hMs ?? 0) >= 4) flags.push("wind_speed_shift");
  if (raw.pressureHPa < 995) flags.push("low_pressure");
  if (raw.cloudCoverPercent < 30) flags.push("bright_sun");
  if (raw.cloudCoverPercent >= 70) flags.push("cloudy");
  if (["S", "SW", "W"].includes(raw.windDirection)) flags.push("favorable_wind");
  if (["N", "NE", "E"].includes(raw.windDirection)) flags.push("unfavorable_wind");
  if (raw.windGustsMs >= 12) flags.push("strong_gusts");
  if (raw.waterClarity === "slightly_tea_clear") flags.push("tea_clear_water");
  if (raw.waterClarity === "moderately_muddy") flags.push("muddy_risk");
  if (raw.waterClarity === "strongly_muddy") flags.push("strong_muddy_risk");
  if (raw.waterLevel === "flood_risk") flags.push("flood_risk");
  if (raw.waterLevel === "slightly_low") flags.push("clear_low_water");

  return flags;
}

function buildCaps(raw) {
  const caps = [];

  if (raw.waterLevel === "flood_risk") caps.push("flood_cap_35");

  return caps;
}

function getConfidence(raw) {
  if (raw.waterClarity === "strongly_muddy" || raw.waterLevel === "flood_risk") return "low";
  if (raw.precipitation72hMm >= 18) return "low";
  return "medium";
}

function isTodayOrFuture(date) {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return date >= todayString;
}

function compassShiftDegrees(previousDirection, currentDirection) {
  const degrees = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315
  };

  const previous = degrees[previousDirection];
  const current = degrees[currentDirection];
  if (previous == null || current == null) return 0;

  const diff = Math.abs(current - previous);
  return Math.min(diff, 360 - diff);
}

function interpolate(value, inputMin, inputMax, outputMin, outputMax) {
  const ratio = clamp((value - inputMin) / (inputMax - inputMin), 0, 1);
  return Math.round(outputMin + ratio * (outputMax - outputMin));
}

function average(values) {
  const numeric = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (!numeric.length) return 0;
  return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, digits = 1) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

module.exports = {
  buildConditionsFromWeather,
  buildDayConditions,
  estimateWaterTemperature,
  estimateWaterClarity,
  estimateWaterLevel
};
