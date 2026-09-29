(function (root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  else { root.TroutEngine = engine; root.fetchOnlineResults = engine.fetchOnlineResults; }
})(typeof window !== "undefined" ? window : globalThis, function () {
  const MODEL_VERSION = "0.6";
  const REGIONS = [
    { id: "south_west", direction: "Юго-запад Ленинградской области", settlement: "Систо-Палкино", latitude: 59.800096, longitude: 28.915934 },
    { id: "south", direction: "Юг Ленинградской области", settlement: "Сиверский", latitude: 59.354888, longitude: 30.067071 },
    { id: "north_east", direction: "Северо-восток Ленинградской области", settlement: "Сосново, Приозерский район", latitude: 60.557705, longitude: 30.253624 },
    { id: "north", direction: "Север Ленинградской области", settlement: "Приозерск", latitude: 61.035979, longitude: 30.115589 },
    { id: "north_west", direction: "Северо-запад Ленинградской области", settlement: "Выборг", latitude: 60.710496, longitude: 28.749781 }
  ];

  const HOURLY = ["temperature_2m", "pressure_msl", "precipitation", "cloud_cover", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"];
  const WEIGHTS = { waterTemperature: 0.30, season: 0.20, weatherChange: 0.15, waterClarity: 0.12, light: 0.12, waterLevel: 0.06, wind: 0.05 };
  const LABELS = { waterTemperature: "Температурный режим воды", season: "Сезонная фаза и кормовой фон", weatherChange: "Изменение погоды", waterClarity: "Прозрачность и мутность", light: "Освещенность", waterLevel: "Водный режим", wind: "Ветер" };
  const HINTS = {
    waterTemperature: ["температурный фон воды близок к рабочей зоне форели", "температура воды снижает активность форели", "температура воды рабочая, но не идеальная"],
    season: ["сезонная фаза поддерживает кормовую активность", "сезонная фаза ограничивает активность рыбы", "сезонная фаза еще не дает максимальной активности"],
    waterClarity: ["прозрачность воды помогает рыбе видеть приманку", "мутность или чрезмерная прозрачность ухудшают условия", "прозрачность воды неоднозначна и требует подбора приманки"],
    light: ["освещенность мягкая и не делает рыбу излишне осторожной", "освещенность делает рыбу осторожнее", "освещенность нейтральная, без сильного плюса"],
    wind: ["сила ветра и порывы не создают выраженных помех для ловли", "сильный ветер или порывы затрудняют заброс и контроль приманки", "ветер требует выбора защищенного участка"],
    waterLevel: ["по осадкам не ожидается крайних изменений потока", "возможны выраженные отклонения водного режима", "состояние потока требует проверки на месте"]
  };

  async function fetchOnlineResults() {
    const weather = await fetchWeather();
    const conditions = buildConditions(weather);
    return buildResults(conditions);
  }

  async function fetchWeather() {
    const params = new URLSearchParams({
      latitude: REGIONS.map((region) => region.latitude).join(","),
      longitude: REGIONS.map((region) => region.longitude).join(","),
      hourly: HOURLY.join(","),
      timezone: "Europe/Moscow",
      past_days: "4",
      forecast_days: "5",
      wind_speed_unit: "ms",
      precipitation_unit: "mm"
    });

    const payload = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const locations = Array.isArray(payload) ? payload : [payload];
    if (locations.length !== REGIONS.length || locations.some((location) => !location?.hourly?.time?.length)) {
      throw new Error("Неполный ответ Open-Meteo по районам");
    }

    return {
      metadata: { source: "open-meteo-online", generatedAt: new Date().toISOString() },
      regions: locations.map((location, index) => {
        const region = REGIONS[index];
        return {
          regionId: region.id,
          direction: region.direction,
          settlement: region.settlement,
          forecastDays: buildDailyForecast(location.hourly || {})
        };
      })
    };
  }

  async function fetchJson(url, timeoutMs = 15000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`);
      return await response.json();
    } finally { clearTimeout(timeout); }
  }

  function moscowDate(now = new Date()) {
    return new Date(now.getTime() + 3 * 3600000).toISOString().slice(0, 10);
  }

  function buildDailyForecast(hourly, now = new Date()) {
    const dayMap = new Map();
    const rows = new Map();
    const ranges = { temperature_2m: [-70, 60], pressure_msl: [850, 1100], precipitation: [0, 300], cloud_cover: [0, 100], wind_speed_10m: [0, 100], wind_direction_10m: [0, 360], wind_gusts_10m: [0, 150] };
    for (const [index, time] of (hourly.time || []).entries()) {
      if (typeof time !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:00$/.test(time)) throw new Error("Некорректное время погоды");
      const timestamp = Date.parse(`${time}+03:00`);
      if (!Number.isFinite(timestamp) || rows.has(timestamp)) throw new Error("Повтор или ошибка времени погоды");
      const row = { timestamp };
      for (const key of HOURLY) {
        const value = hourly[key]?.[index];
        row[key] = Number.isFinite(value) && value >= ranges[key][0] && value <= ranges[key][1] ? value : null;
      }
      rows.set(timestamp, row);
      const date = time.slice(0, 10);
      if (!dayMap.has(date)) dayMap.set(date, []);
      dayMap.get(date).push(row);
    }
    const days = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, bucket]) => {
      const values = (key) => bucket.map((row) => row[key]).filter(Number.isFinite);
      const enough = (key) => values(key).length >= 18;
      const mean = (key) => enough(key) ? round(avg(values(key))) : null;
      const pressure = mean("pressure_msl");
      const windDirectionDegrees = enough("wind_direction_10m") ? circularMean(values("wind_direction_10m")) : null;
      const referenceMs = date === moscowDate(now) ? Math.floor(now.getTime() / 3600000) * 3600000 : Date.parse(`${date}T12:00:00+03:00`);
      const at = (offset) => rows.get(referenceMs - offset * 3600000);
      const pressureValues = Array.from({ length: 73 }, (_, i) => at(72 - i)?.pressure_msl ?? null);
      const pressureTrend = pressureTrendStats(pressureValues.map((p) => Number.isFinite(p) ? p * 0.750062 : null));
      // Open-Meteo precipitation at t is the sum for (t - 1 hour, t].
      const rainSum = (hours) => {
        const rain = Array.from({ length: hours }, (_, i) => at(i)?.precipitation ?? null);
        return rain.every(Number.isFinite) ? round(sum(rain)) : null;
      };
      const pressureChange = Number.isFinite(at(0)?.pressure_msl) && Number.isFinite(at(24)?.pressure_msl)
        ? round(at(0).pressure_msl - at(24).pressure_msl) : null;
      return {
        date,
        referenceAt: new Date(referenceMs).toISOString(),
        temperatureMeanC: mean("temperature_2m"),
        temperatureMinC: enough("temperature_2m") ? round(Math.min(...values("temperature_2m"))) : null,
        temperatureMaxC: enough("temperature_2m") ? round(Math.max(...values("temperature_2m"))) : null,
        pressureMeanHPa: pressure,
        pressureMeanMmHg: Number.isFinite(pressure) ? round(pressure * 0.750062) : null,
        precipitationSumMm: bucket.length === 24 && values("precipitation").length === 24 ? round(sum(values("precipitation"))) : null,
        cloudCoverMeanPercent: mean("cloud_cover"),
        windSpeedMeanMs: mean("wind_speed_10m"),
        windGustMaxMs: enough("wind_gusts_10m") ? round(Math.max(...values("wind_gusts_10m"))) : null,
        windDirection: degreesToCompass(windDirectionDegrees),
        windDirectionDegrees: round(windDirectionDegrees),
        pressureChange24hHPa: pressureChange,
        pressureChange24hMmHg: Number.isFinite(pressureChange) ? round(pressureChange * 0.750062) : null,
        pressureAmplitude72hMmHg: pressureTrend.amplitudeMmHg,
        pressureNetChange72hMmHg: pressureTrend.netChangeMmHg,
        pressureDirectionChanges72h: pressureTrend.directionChanges,
        pressureTrendKind: pressureTrend.kind,
        precipitation24hMm: rainSum(24),
        precipitation72hMm: rainSum(72),
        incompleteDailyData: HOURLY.some((key) => values(key).length < 24)
      };
    });

    return days.map((day, index) => {
      const prev = days[index - 1];
      return {
        ...day,
        temperatureChange24hC: Number.isFinite(prev?.temperatureMeanC) && Number.isFinite(day.temperatureMeanC) ? round(day.temperatureMeanC - prev.temperatureMeanC) : null
      };
    });
  }

  function pressureTrendStats(hourlyValues) {
    if (hourlyValues.length !== 73 || !hourlyValues.every(Number.isFinite)) {
      return { amplitudeMmHg: null, netChangeMmHg: null, directionChanges: null, kind: "unknown" };
    }
    // Three-hour medians suppress isolated spikes; reversals must exceed 2 mm Hg.
    const values = hourlyValues.slice(2).map((_, i) => [...hourlyValues.slice(i, i + 3)].sort((a, b) => a - b)[1]);
    const amplitudeMmHg = round(Math.max(...values) - Math.min(...values));
    const netChangeMmHg = round(hourlyValues[72] - hourlyValues[0]);
    let directionChanges = 0;
    let direction = 0;
    let extreme = values[0];
    for (const value of values.slice(1)) {
      if (direction === 0) {
        if (Math.abs(value - extreme) > 2.000001) { direction = Math.sign(value - extreme); extreme = value; }
      } else if ((value - extreme) * direction >= 0) extreme = value;
      else if (Math.abs(value - extreme) > 2.000001) { directionChanges += 1; direction *= -1; extreme = value; }
    }
    let kind = "directional";
    if (amplitudeMmHg <= 2) kind = "stable";
    else if (directionChanges >= 2 && amplitudeMmHg >= 10) kind = "strong_saw";
    else if (directionChanges >= 2 && amplitudeMmHg >= 6) kind = "saw";
    else if (directionChanges >= 1 && amplitudeMmHg >= 3) kind = "unstable";
    return { amplitudeMmHg, netChangeMmHg, directionChanges, kind };
  }

  function buildConditions(weather) {
    return {
      metadata: { version: "0.1", dataType: "online-conditions", modelVersion: MODEL_VERSION, generatedAt: weather.metadata.generatedAt, source: weather.metadata.source },
      regions: Object.fromEntries(weather.regions.map((region) => [
        region.regionId,
        {
          summary: `${region.direction}: ${region.settlement}. Онлайн-данные Open-Meteo, гидрология рассчитана косвенно.`,
          forecast: region.forecastDays.map((day, index, days) => buildDayConditions(day, index, days)).filter((day) => isTodayOrFuture(day.date)).slice(0, 5)
        }
      ]))
    };
  }

  function buildDayConditions(day, index, days) {
    const waterTemp = estimateWaterTemperature(day, days, index);
    const clarity = estimateWaterClarity(day);
    const level = estimateWaterLevel(day);
    const prevWind = days[index - 1]?.windDirection || null;
    const windDirectionChangeDegrees = prevWind && day.windDirection ? compassShift(prevWind, day.windDirection) : null;
    const windSpeedChange24hMs = Number.isFinite(days[index - 1]?.windSpeedMeanMs) && Number.isFinite(day.windSpeedMeanMs) ? round(day.windSpeedMeanMs - days[index - 1].windSpeedMeanMs) : null;
    const pressureChange24hHPa = day.pressureChange24hHPa;

    const raw = {
      estimatedWaterTemperatureC: waterTemp,
      airTemperatureC: day.temperatureMeanC,
      pressureHPa: day.pressureMeanHPa,
      pressureMmHg: day.pressureMeanMmHg,
      pressureChange24hHPa,
      pressureChange24hMmHg: day.pressureChange24hMmHg ?? null,
      pressureAmplitude72hMmHg: day.pressureAmplitude72hMmHg ?? null,
      pressureNetChange72hMmHg: day.pressureNetChange72hMmHg ?? null,
      pressureDirectionChanges72h: day.pressureDirectionChanges72h ?? null,
      pressureTrendKind: day.pressureTrendKind || "unknown",
      temperatureChange24hC: day.temperatureChange24hC ?? null,
      referenceAt: day.referenceAt || null,
      incompleteDailyData: day.incompleteDailyData || false,
      precipitation24hMm: day.precipitation24hMm,
      precipitation72hMm: day.precipitation72hMm,
      cloudCoverPercent: day.cloudCoverMeanPercent,
      windDirection: day.windDirection,
      windDirectionDegrees: day.windDirectionDegrees,
      windSpeedMs: day.windSpeedMeanMs,
      windGustsMs: day.windGustMaxMs,
      windDirectionPrevious: prevWind,
      windDirectionChangeDegrees,
      windSpeedChange24hMs,
      waterClarity: clarity,
      waterLevel: level
    };
    raw.weatherChangeComponents = scoreWeatherComponents(raw);

    const factorScores = {
      waterTemperature: Number.isFinite(waterTemp) ? scoreWaterTemperature(waterTemp) : null,
      season: scoreSeason(day.date),
      weatherChange: scoreWeatherChange(raw),
      waterClarity: clarity ? scoreWaterClarity(clarity) : null,
      light: Number.isFinite(day.cloudCoverMeanPercent) && Number.isFinite(waterTemp) ? scoreLight(day.cloudCoverMeanPercent, day.date, waterTemp) : null,
      waterLevel: level ? scoreWaterLevel(level) : null,
      wind: scoreWind(day.windSpeedMeanMs, day.windGustMaxMs)
    };

    return { date: day.date, confidence: Object.values(factorScores).some((score) => score === null) || raw.incompleteDailyData ? "low" : getConfidence(raw), raw, factorScores, flags: buildFlags(raw) };
  }

  function buildResults(conditions) {
    return {
      metadata: { version: "0.1", dataType: "online-results", modelVersion: MODEL_VERSION, generatedAt: conditions.metadata.generatedAt, source: conditions.metadata.source },
      regions: Object.fromEntries(Object.entries(conditions.regions).map(([regionId, region]) => [
        regionId,
        { summary: region.summary, forecast: region.forecast.map((day) => ({ ...calculateIndex(day), raw: day.raw })) }
      ]))
    };
  }

  function calculateFactorContributions(scores = {}) {
    return Object.entries(WEIGHTS).map(([id, weight]) => {
      const score = Number.isFinite(scores[id]) ? clamp(scores[id], 0, 100) : null;
      if (score === null) return { id, label: LABELS[id], weight, weightPercent: Math.round(weight * 100), score: null, contribution: null, status: "нет данных", explanation: "недостаточно исходных данных" };
      return { id, label: LABELS[id], weight, weightPercent: Math.round(weight * 100), score, contribution: round(score * weight, 2), status: score >= 75 ? "помогает" : score >= 50 ? "нейтрально" : "мешает", explanation: factorExplanation(id, score) };
    });
  }

  function calculateIndex(conditions) {
    const factors = calculateFactorContributions(conditions.factorScores);
    const missing = factors.filter((factor) => factor.score === null);
    if (missing.length) return { date: conditions.date, index: null, indexRaw: null, rating: "нет оценки", confidence: "low", summary: "Недостаточно погодных данных для расчета индекса.", factors, positiveDrivers: [], negativeDrivers: [], recommendations: ["Рекомендации по этим данным недоступны. Повтори обновление погоды."], warnings: [`Нет оценки факторов: ${missing.map((factor) => factor.label).join(", ")}. Веса не перераспределялись.`], appliedCaps: [], flags: conditions.flags || [] };
    const indexRaw = round(factors.reduce((total, factor) => total + factor.contribution, 0), 2);
    const index = Math.round(indexRaw);
    const drivers = getDrivers(factors);
    const rating = getRating(index);
    return { date: conditions.date, index, indexRaw: round(indexRaw, 2), rating, confidence: conditions.confidence || "medium", summary: getSummary(rating, drivers), factors, ...drivers, recommendations: getRecommendations(conditions), warnings: getWarnings(conditions), appliedCaps: [], flags: conditions.flags || [] };
  }

  function estimateWaterTemperature(day, days, index) {
    const current = day.temperatureMeanC;
    if (!Number.isFinite(current)) return null;
    const previous = days.slice(Math.max(0, index - 3), index).map((item) => item.temperatureMeanC);
    const smoothedAir = avg([current, ...previous].filter(Number.isFinite));
    if (previous.some((value) => !Number.isFinite(value))) return null;
    const profile = seasonalProfile(day.date);
    const estimated = profile.baseC + (smoothedAir - profile.referenceAirC) * profile.airWeight + ((day.temperatureMaxC ?? current) - profile.referenceAirC) * profile.currentAirWeight;
    return round(clamp(estimated, profile.minC, profile.maxC));
  }

  function calendarBlend(date) {
    const time = Date.parse(`${date}T12:00:00Z`);
    const d = new Date(time);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const leftMonth = d.getUTCDate() >= 15 ? month : month - 1;
    const left = Date.UTC(year, leftMonth, 15, 12);
    const right = Date.UTC(year, leftMonth + 1, 15, 12);
    return { left: ((leftMonth + 12) % 12) + 1, right: ((leftMonth + 13) % 12) + 1, ratio: (time - left) / (right - left) };
  }

  function seasonalProfile(date) {
    const profiles = {
      1: [3.2, 2.5, 4.5, -4, .08, .03], 2: [3, 2.5, 4.5, -4, .08, .03], 3: [4.8, 3.5, 6.5, 0, .12, .05], 4: [7, 5.8, 10, 5, .18, .07],
      5: [10, 7.5, 14, 11, .26, .10], 6: [13.5, 9, 17, 16, .30, .12], 7: [15.5, 10, 20.5, 18, .34, .14], 8: [15, 10, 20, 17, .32, .12],
      9: [12, 8, 16.5, 12, .24, .08], 10: [8, 5, 12, 7, .20, .06], 11: [5, 3.5, 8, 2, .14, .04], 12: [3.5, 2.5, 5.5, -2, .10, .03]
    };
    const { left, right, ratio } = calendarBlend(date);
    const [baseC, minC, maxC, referenceAirC, airWeight, currentAirWeight] = profiles[left].map((value, i) => value + (profiles[right][i] - value) * ratio);
    return { baseC, minC, maxC, referenceAirC, airWeight, currentAirWeight };
  }

  function estimateWaterClarity(day) {
    const p24 = day.precipitation24hMm;
    const p72 = day.precipitation72hMm;
    if (!Number.isFinite(p24) || !Number.isFinite(p72)) return null;
    if (p24 >= 20 || p72 >= 40) return "strongly_muddy";
    if (p24 >= 9 || p72 >= 25) return "moderately_muddy";
    if (p24 >= 3 || p72 >= 10) return "slightly_colored_clear";
    if (p24 > 0 || p72 > 0) return "slightly_tea_clear";
    return "clear";
  }

  function estimateWaterLevel(day) {
    const p24 = day.precipitation24hMm;
    const p72 = day.precipitation72hMm;
    if (!Number.isFinite(p24) || !Number.isFinite(p72)) return null;
    if (p24 >= 25 || p72 >= 50) return "flood_risk";
    if (p24 >= 15 || p72 >= 35) return "high";
    if (p24 >= 6 || p72 >= 18) return "slightly_high";
    if (p72 <= 1) return "slightly_low";
    return "normal";
  }

  function scoreWaterTemperature(temp) {
    if (!Number.isFinite(temp)) return null;
    const anchors = [[2, 20], [3, 30], [5, 50], [6, 60], [9, 80], [10, 98], [15, 98], [16, 88], [17, 75], [18, 60], [19, 35], [20, 20]];
    if (temp <= 2 || temp >= 20) return 20;
    const index = anchors.findIndex(([value]) => value >= temp);
    return interpolate(temp, anchors[index - 1][0], anchors[index][0], anchors[index - 1][1], anchors[index][1]);
  }
  function scoreSeason(date) {
    const scores = { 1: 20, 2: 20, 3: 30, 4: 55, 5: 86, 6: 92, 7: 78, 8: 82, 9: 92, 10: 78, 11: 40, 12: 20 };
    const { left, right, ratio } = calendarBlend(date);
    return Math.round(scores[left] + (scores[right] - scores[left]) * ratio);
  }
  function scoreWaterClarity(c) { return { crystal_clear: 78, clear: 88, slightly_tea_clear: 95, slightly_colored_clear: 84, moderately_muddy: 52, strongly_muddy: 22 }[c] ?? 60; }
  function scoreLight(cloud, date, waterTemp) { const m = new Date(`${date}T12:00:00`).getMonth() + 1; if (cloud >= 45 && cloud <= 90) return 92; if (cloud > 90) return 78; if (cloud < 25) { if (m <= 4 || waterTemp <= 6) return 74; if (m >= 7 && m <= 8) return 45; return 58; } return 74; }
  function scoreWind(speed, gusts) {
    if (!Number.isFinite(speed) || !Number.isFinite(gusts)) return null;
    let sustained = 95;
    if (speed > 10) sustained = interpolate(speed, 10, 20, 48, 10);
    else if (speed > 7) sustained = interpolate(speed, 7, 10, 72, 48);
    else if (speed > 4) sustained = interpolate(speed, 4, 7, 95, 72);
    let gustScore = 100;
    if (gusts > 18) gustScore = interpolate(gusts, 18, 25, 40, 15);
    else if (gusts > 12) gustScore = interpolate(gusts, 12, 18, 75, 40);
    else if (gusts > 7) gustScore = interpolate(gusts, 7, 12, 100, 75);
    return Math.min(sustained, gustScore);
  }
  function scoreWaterLevel(level) { return { normal: 90, slightly_low: 82, low: 70, critically_low: 35, slightly_high: 82, high: 48, flood_risk: 18 }[level] ?? 75; }
  function classifyPressure(raw) {
    const delta = raw.pressureChange24hMmHg;
    if (!Number.isFinite(delta)) return "unknown";
    if (delta <= -7) return "sharp_fall";
    if (delta < -4) return "moderate_fall";
    if (delta < -1) return "smooth_fall";
    if (delta <= 1) return "stable";
    if (delta <= 4) return "smooth_rise";
    if (delta < 7) return "moderate_rise";
    return "sharp_rise";
  }

  function isStableWeather(raw) {
    return ["stable", "smooth_fall", "smooth_rise"].includes(classifyPressure(raw))
      && ["stable", "directional"].includes(raw.pressureTrendKind)
      && Number.isFinite(raw.pressureAmplitude72hMmHg) && raw.pressureAmplitude72hMmHg < 6
      && Number.isFinite(raw.windDirectionChangeDegrees) && raw.windDirectionChangeDegrees < 90
      && Number.isFinite(raw.windSpeedChange24hMs) && Math.abs(raw.windSpeedChange24hMs) < 4
      && Number.isFinite(raw.temperatureChange24hC) && Math.abs(raw.temperatureChange24hC) < 5
      && Number.isFinite(raw.windGustsMs) && raw.windGustsMs < 12
      && Number.isFinite(raw.precipitation24hMm) && raw.precipitation24hMm < 9;
  }

  function isPrefrontalWindow(raw) {
    return classifyPressure(raw) === "smooth_fall" && isStableWeather(raw)
      && raw.cloudCoverPercent >= 60 && Number.isFinite(raw.windSpeedMs) && raw.windSpeedMs < 7
      && ["clear", "crystal_clear", "slightly_tea_clear", "slightly_colored_clear"].includes(raw.waterClarity)
      && ["normal", "slightly_low", "slightly_high"].includes(raw.waterLevel);
  }

  function scoreWeatherComponents(raw) {
    const required = ["pressureChange24hMmHg", "pressureAmplitude72hMmHg", "pressureDirectionChanges72h", "temperatureChange24hC", "windDirectionChangeDegrees", "windSpeedChange24hMs"];
    if (required.some((key) => !Number.isFinite(raw[key])) || !["stable", "directional", "unstable", "saw", "strong_saw"].includes(raw.pressureTrendKind)) return null;
    const pressureTrendScore = { stable: 98, smooth_fall: 100, moderate_fall: 72, sharp_fall: 52, smooth_rise: 76, moderate_rise: 50, sharp_rise: 28 }[classifyPressure(raw)];
    const temp = Math.abs(raw.temperatureChange24hC);
    const shift = raw.windDirectionChangeDegrees;
    const speedShift = Math.abs(raw.windSpeedChange24hMs);
    const amp = raw.pressureAmplitude72hMmHg;
    let stabilityScore = 88;
    let windScore = 100;
    let temperatureScore = 92;
    if (amp <= 2) stabilityScore = 98;
    else if (raw.pressureTrendKind === "strong_saw") stabilityScore = 25;
    else if (raw.pressureTrendKind === "saw") stabilityScore = 45;
    else if (raw.pressureTrendKind === "unstable") stabilityScore = 72;
    else if (amp >= 10) stabilityScore = 50;
    else if (amp >= 6) stabilityScore = 68;
    if (shift >= 135) windScore -= 30;
    else if (shift >= 90) windScore -= 18;
    if (speedShift >= 6) windScore -= 24;
    else if (speedShift >= 4) windScore -= 16;
    else if (speedShift >= 2.5) windScore -= 8;
    if (temp >= 10) temperatureScore = 25;
    else if (temp >= 7) temperatureScore = 40;
    else if (temp >= 5) temperatureScore = 60;
    else if (temp >= 3) temperatureScore = 75;
    return { pressure: round((pressureTrendScore * 2 + stabilityScore) / 3, 2), temperature: temperatureScore, wind: clamp(windScore, 0, 100) };
  }

  function scoreWeatherChange(raw) {
    const scores = scoreWeatherComponents(raw);
    // Each component occupies one third of the 15% weather factor: at most 5 index points.
    return scores ? round((scores.pressure + scores.temperature + scores.wind) / 3, 2) : null;
  }

  function getDrivers(factors) { return { positiveDrivers: factors.filter((f) => f.score >= 80).sort((a, b) => b.contribution - a.contribution).slice(0, 3).map(driver), negativeDrivers: factors.filter((f) => f.score < 60).sort((a, b) => a.score - b.score || b.weight - a.weight).slice(0, 3).map(driver) }; }
  function driver(f) { return { factor: f.label, score: f.score, reason: f.explanation }; }
  function getRating(index) { if (index <= 25) return "плохо"; if (index <= 50) return "слабо"; if (index <= 70) return "перспективно"; if (index <= 85) return "хорошо"; return "отлично"; }
  function getSummary(rating, drivers) { const best = drivers.positiveDrivers[0]?.factor; const worst = drivers.negativeDrivers[0]?.factor; if (rating === "отлично") return `Очень сильное сочетание условий. Главный плюс: ${best || "несколько ключевых факторов работают в плюс"}.`; if (rating === "хорошо") return `Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: ${best || "стабильный общий фон"}.`; if (rating === "перспективно") return `Есть рабочие условия, но прогноз не без слабых мест. Главный риск: ${worst || "локальные различия воды"}.`; if (rating === "слабо") return `Условия слабые, поездка требует точного выбора места и тактики. Главный минус: ${worst || "несколько факторов против клева"}.`; return `Условия неблагоприятные. Главный минус: ${worst || "сильное сочетание негативных факторов"}.`; }

  function getRecommendations(conditions) {
    const raw = conditions.raw || {};
    if (raw.estimatedWaterTemperatureC >= 20) return ["Модель ловли: расчет указывает на слишком теплую воду. Измерь температуру на месте. При подтверждении перегрева лучше отложить ловлю или выбрать более холодный водоток, независимо от общего индекса."];
    if (raw.waterLevel === "flood_risk") return ["Модель ловли: по осадкам возможен паводок. Сначала оцени безопасность подхода и состояние потока. При опасном течении откажись от ловли на этом участке, даже если другие факторы благоприятны."];
    const rec = [];
    const clarity = raw.waterClarity;
    const bright = (conditions.flags || []).includes("bright_sun") || (raw.cloudCoverPercent ?? 100) < 30;
    const muddy = clarity === "moderately_muddy" || clarity === "strongly_muddy";
    const stable = isStableWeather(raw);
    const activeTemp = (conditions.factorScores?.waterTemperature ?? 0) >= 85;
    const lowWater = raw.waterLevel === "slightly_low" || raw.waterLevel === "low" || (conditions.flags || []).includes("clear_low_water");
    const strongWind = raw.windSpeedMs >= 7 || raw.windGustsMs >= 12;
    const coldWater = raw.estimatedWaterTemperatureC <= 9;
    const veryClear = clarity === "crystal_clear" || clarity === "clear";
    rec.push(timingRecommendation(conditions));
    rec.push(castingRecommendation(conditions));
    if (coldWater) rec.push("Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.");
    else if (activeTemp && stable && !muddy && !bright) rec.push("Модель ловли: сочетание условий допускает активную подачу. Начни с маленького воблера-минноу или вращающейся блесны, облавливай перекаты, кромки струи и входы в ямы.");
    else if (muddy) rec.push("Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.");
    else if (bright || lowWater || veryClear) rec.push("Модель ловли: форель будет осторожнее обычного. Подходи ниже по течению, держи дистанцию, делай первые забросы издалека и начинай с натуральных воблеров, микроколебалок или мягкой резины без лишнего блеска.");
    else rec.push("Модель ловли: сочетание условий неоднородное. Начни со спокойной равномерной проводки небольшой колебалки или воблера у укрытий и кромки струи. Подбирай скорость по реакции рыбы, без резкого ускорения подачи.");
    if (clarity === "crystal_clear") rec.push("Приманки: кристально прозрачная вода просит натуральные цвета, маленькие воблеры 30-50 мм, микроколебалки 1.5-3 г и некрупный силикон. Проводка спокойная, без лишней агрессии.");
    if (clarity === "slightly_tea_clear") rec.push("Приманки: слегка чайная прозрачная вода хороша для меди, золота, темных силуэтов, маленьких колебалок и минноу с умеренным контрастом.");
    if (clarity === "moderately_muddy") rec.push("Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.");
    if (clarity === "strongly_muddy") rec.push("Приманки: при сильной мутности используй крупнее силуэт, яркий контраст и вибрацию; при этом общий потенциал ловли низкий.");
    if (strongWind) rec.push("Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.");
    if (lowWater) rec.push("На низкой воде ищи ямки, тень, укрытия и локальные стоянки, не заходи в воду без необходимости.");
    if (coldWater) rec.push("Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.");
    if (!coldWater && stable && !strongWind && !bright && !muddy && raw.windSpeedMs >= 1 && raw.windSpeedMs <= 4) rec.push("Подача: легкая рябь и мягкий свет позволяют ловить активнее: равномерная проводка вращалки или воблера поперек/на снос будет хорошей стартовой схемой.");
    if (isPrefrontalWindow(raw)) rec.push("Погодная интерпретация: плавное снижение давления и облачность совместимы с приближением фронта, но сами по себе не подтверждают циклон, вылет насекомых или усиление клева. Проверь активность рыбы и прозрачность на месте.");
    if (stable && raw.pressureAmplitude72hMmHg <= 2) rec.push("Погодная интерпретация: давление за 72 часа без значимых колебаний. Модель считает такой фон благоприятным; это не гарантия активности рыбы.");
    return rec.length ? rec : ["Условия ровные: начни с классической подачи, затем подстраивай размер и цвет под прозрачность воды."];
  }

  function timingRecommendation(conditions) {
    const raw = conditions.raw || {};
    const month = new Date(`${conditions.date}T12:00:00`).getMonth() + 1;
    const cold = raw.estimatedWaterTemperatureC <= 9;
    const warm = raw.estimatedWaterTemperatureC >= 18;
    const bright = (conditions.flags || []).includes("bright_sun") || (raw.cloudCoverPercent ?? 100) < 30;
    if (cold) return "Когда ловить: в холодной воде перспективнее день и ближе к вечеру, если вода успевает прогреться. Проверь температуру на месте.";
    if (warm || month === 7 || month === 8) return "Когда ловить: начни с более прохладного утра. Вечером оцени температуру воды и тень, а середину жаркого дня лучше пропустить при перегреве ручья.";
    if (bright) return "Когда ловить: при ярком солнце начни с утра или вечера. Днем выбирай тень, нависающие берега и закрытые лесом участки.";
    if (month >= 9 && month <= 10) return "Когда ловить: при подходящей температуре и мягком свете осенью можно пробовать утром, днем и вечером. Ориентируйся на местный кормовой фон и наблюдения за рыбой.";
    if (month <= 4) return "Когда ловить: весной проверь дневные и вечерние часы после прогрева воды. При устойчивой температуре выбирай время по свету и местной кормовой активности.";
    if (isStableWeather(raw) && raw.cloudCoverPercent >= 55) return "Когда ловить: утро, день и вечер могут быть рабочими. При мягком свете и спокойной погоде выбирай время по доступному корму и состоянию ручья.";
    return "Когда ловить: начни с утра или вечера, а днем смещайся к тени, глубине и участкам с более спокойной подачей.";
  }
  function castingRecommendation(conditions) { const raw = conditions.raw || {}; const clarity = raw.waterClarity; const bright = (conditions.flags || []).includes("bright_sun") || (raw.cloudCoverPercent ?? 100) < 30; const low = raw.waterLevel === "slightly_low" || raw.waterLevel === "low" || (conditions.flags || []).includes("clear_low_water"); const clear = clarity === "crystal_clear" || clarity === "clear"; const tea = clarity === "slightly_tea_clear" || clarity === "slightly_colored_clear"; const muddy = clarity === "moderately_muddy" || clarity === "strongly_muddy"; const ripple = raw.windSpeedMs >= 1 && raw.windSpeedMs <= 4; if ((bright && clear) || (clear && low)) return "Дальность и скрытность: форель, скорее всего, видит рыболова далеко. Первые забросы делай с дальней дистанции, заходи низко и тихо, не выходи на открытый берег до проверки ближних точек."; if (bright || low) return "Дальность и скрытность: осторожность повышена. Начинай издалека, двигайся медленно, используй береговые укрытия и не становись силуэтом на фоне неба."; if (muddy) return "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам."; if (tea || ripple) return "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами."; return "Дальность и скрытность: держи среднюю дистанцию, сначала облавливай ближние перспективные точки, затем переходи к дальним забросам вверх или поперек течения."; }
  function getWarnings(conditions) {
    const raw = conditions.raw || {};
    const warnings = [];
    const pressure = classifyPressure(raw);
    if (pressure === "sharp_fall") warnings.push("давление резко падает: проверь, сопровождается ли это охлаждением и сменой ветра. Само снижение не подтверждает усиление или прекращение клева");
    if (pressure === "sharp_rise") warnings.push("давление резко растет: оцени весь погодный переход. Один барометрический сигнал не является основанием отказываться от поездки");
    if (["saw", "strong_saw"].includes(raw.pressureTrendKind)) warnings.push(`давление идет пилой: размах ${raw.pressureAmplitude72hMmHg} мм рт. ст. за 72 ч и ${raw.pressureDirectionChanges72h} смены направления`);
    if (raw.windDirectionChangeDegrees >= 90 || Math.abs(raw.windSpeedChange24hMs) >= 4) warnings.push("ветер заметно меняется по направлению или силе, погодный режим нестабилен");
    if (raw.waterClarity === "strongly_muddy") warnings.push("по осадкам возможна сильная мутность. Проверь видимость в конкретном ручье");
    if (raw.windSpeedMs >= 8 || raw.windGustsMs >= 12) warnings.push("сильный ветер или порывы могут мешать забросу и проводке");
    if (raw.waterLevel === "flood_risk") warnings.push("возможен паводок: безопасность подхода и потока важнее индекса. Предупреждение не вычитает дополнительные баллы");
    if (raw.waterLevel === "critically_low") warnings.push("критически низкая вода требует проверки состояния ручья и рыбы на месте");
    if (raw.estimatedWaterTemperatureC >= 20) warnings.push("расчетная температура воды от 20 °C: возможен тепловой стресс. При подтвержденном перегреве лучше отложить ловлю независимо от индекса");
    return warnings;
  }
  function factorExplanation(id, score) {
    if (id === "weatherChange") {
      if (score >= 80) return "совокупная оценка динамики высокая; отдельные изменения погоды могут оставаться неблагоприятными";
      if (score >= 60) return "есть заметные изменения погоды, оцени их вместе с состоянием ручья";
      return "выраженная динамика температуры, ветра или давления снижает оценку";
    }
    if (score >= 75) return HINTS[id][0];
    if (score < 60) return HINTS[id][1];
    return HINTS[id][2];
  }
  function buildFlags(raw) {
    const flags = [];
    const pressure = classifyPressure(raw);
    if (isStableWeather(raw)) flags.push("stable_weather");
    if (pressure === "stable" && raw.pressureTrendKind === "stable") flags.push("stable_pressure");
    if (pressure === "smooth_fall") flags.push("smooth_pressure_fall");
    if (pressure === "sharp_fall") flags.push("sharp_pressure_drop");
    if (pressure === "sharp_rise") flags.push("sharp_pressure_rise");
    if (["saw", "strong_saw"].includes(raw.pressureTrendKind)) flags.push("pressure_saw");
    if (isPrefrontalWindow(raw)) flags.push("prefrontal_window");
    if (raw.windDirectionChangeDegrees >= 90) flags.push("wind_direction_shift");
    if (Math.abs(raw.windSpeedChange24hMs) >= 4) flags.push("wind_speed_shift");
    if (Number.isFinite(raw.cloudCoverPercent) && raw.cloudCoverPercent < 30) flags.push("bright_sun");
    if (raw.cloudCoverPercent >= 70) flags.push("cloudy");
    if (raw.windGustsMs >= 12) flags.push("strong_gusts");
    if (raw.waterClarity === "slightly_tea_clear") flags.push("tea_clear_water");
    if (raw.waterClarity === "moderately_muddy") flags.push("muddy_risk");
    if (raw.waterClarity === "strongly_muddy") flags.push("strong_muddy_risk");
    if (raw.waterLevel === "flood_risk") flags.push("flood_risk");
    if (raw.waterLevel === "slightly_low") flags.push("clear_low_water");
    return flags;
  }
  function getConfidence(raw) { if (raw.waterClarity === "strongly_muddy" || raw.waterLevel === "flood_risk") return "low"; if (raw.precipitation72hMm >= 18) return "low"; return "medium"; }
  function isTodayOrFuture(date) { return date >= moscowDate(); }
  function push(target, values, index) { const value = Array.isArray(values) ? values[index] : null; if (typeof value === "number" && Number.isFinite(value)) target.push(value); }
  function sum(values) { return values.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0); }
  function avg(values) { const numeric = values.filter(Number.isFinite); return numeric.length ? sum(numeric) / numeric.length : null; }
  function round(value, digits = 1) { if (!Number.isFinite(value)) return null; const m = 10 ** digits; return Math.round(value * m) / m; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function interpolate(value, inMin, inMax, outMin, outMax) { return Math.round(outMin + clamp((value - inMin) / (inMax - inMin), 0, 1) * (outMax - outMin)); }
  function degreesToCompass(degrees) { if (!Number.isFinite(degrees)) return null; const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]; return dirs[Math.round((((degrees % 360) + 360) % 360) / 45) % dirs.length]; }
  function circularMean(degreesList) { if (!degreesList.length) return 0; const radians = degreesList.map((d) => d * Math.PI / 180); const sin = avg(radians.map(Math.sin)); const cos = avg(radians.map(Math.cos)); return ((Math.atan2(sin, cos) * 180 / Math.PI) % 360 + 360) % 360; }
  function compassShift(a, b) { const degrees = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 }; const diff = Math.abs((degrees[a] ?? 0) - (degrees[b] ?? 0)); return Math.min(diff, 360 - diff); }

  return { MODEL_VERSION, REGIONS, FACTOR_WEIGHTS: WEIGHTS, FACTOR_LABELS: LABELS,
    fetchOnlineResults, buildDailyForecast, buildConditions, buildDayConditions, buildResults,
    calculateIndex, calculateFactorContributions, getRating, estimateWaterTemperature, estimateWaterClarity, estimateWaterLevel,
    pressureTrendStats, scoreWeatherComponents, scoreWeatherChange, scoreSeason, scoreWaterTemperature, scoreWind, buildFlags,
    classifyPressure, isStableWeather, isPrefrontalWindow, moscowDate, fetchJson };
});
