(function () {
  const REGIONS = [
    { id: "south_west", direction: "Юго-запад Ленинградской области", settlement: "Систо-Палкино", latitude: 59.800096, longitude: 28.915934 },
    { id: "south", direction: "Юг Ленинградской области", settlement: "Сиверский", latitude: 59.354888, longitude: 30.067071 },
    { id: "north_east", direction: "Северо-восток Ленинградской области", settlement: "Сосново, Приозерский район", latitude: 60.557705, longitude: 30.253624 },
    { id: "north", direction: "Север Ленинградской области", settlement: "Приозерск", latitude: 61.035979, longitude: 30.115589 },
    { id: "north_west", direction: "Северо-запад Ленинградской области", settlement: "Выборг", latitude: 60.710496, longitude: 28.749781 }
  ];

  const HOURLY = ["temperature_2m", "pressure_msl", "precipitation", "cloud_cover", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"];
  const WEIGHTS = { waterTemperature: 0.22, season: 0.21, weatherChange: 0.22, pressure: 0.07, waterClarity: 0.10, light: 0.08, wind: 0.05, waterLevel: 0.03, moon: 0.02 };
  const LABELS = { waterTemperature: "Температура воды", season: "Сезонная фаза", weatherChange: "Изменение погоды", pressure: "Атмосферное давление", waterClarity: "Прозрачность воды", light: "Освещенность", wind: "Ветер", waterLevel: "Уровень воды", moon: "Луна" };
  const HINTS = {
    waterTemperature: ["температурный фон воды близок к рабочей зоне форели", "температура воды снижает активность форели", "температура воды рабочая, но не идеальная"],
    season: ["сезонная фаза поддерживает кормовую активность", "сезонная фаза ограничивает активность рыбы", "сезонная фаза еще не дает максимальной активности"],
    waterClarity: ["прозрачность воды помогает рыбе видеть приманку", "мутность или чрезмерная прозрачность ухудшают условия", "прозрачность воды неоднозначна и требует подбора приманки"],
    light: ["освещенность мягкая и не делает рыбу излишне осторожной", "освещенность делает рыбу осторожнее", "освещенность нейтральная, без сильного плюса"],
    wind: ["ветер по направлению и силе благоприятен", "ветер ухудшает условия или связан с неблагоприятным режимом", "ветер нейтральный или умеренно спорный"],
    waterLevel: ["уровень воды без крайних отклонений", "уровень или сила потока близки к крайним значениям", "уровень воды без явного плюса"],
    moon: ["лунный фактор слегка поддерживает прогноз", "лунный фактор не поддерживает прогноз", "лунный фактор нейтральный"]
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
      past_days: "3",
      forecast_days: "5",
      wind_speed_unit: "ms",
      precipitation_unit: "mm"
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`);
    const payload = await response.json();
    const locations = Array.isArray(payload) ? payload : [payload];

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

  function buildDailyForecast(hourly) {
    const dayMap = new Map();
    const times = hourly.time || [];

    times.forEach((time, index) => {
      const date = time.slice(0, 10);
      const bucket = dayMap.get(date) || { date, t: [], p: [], rain: [], cloud: [], wind: [], dir: [], gust: [] };
      push(bucket.t, hourly.temperature_2m, index);
      push(bucket.p, hourly.pressure_msl, index);
      push(bucket.rain, hourly.precipitation, index);
      push(bucket.cloud, hourly.cloud_cover, index);
      push(bucket.wind, hourly.wind_speed_10m, index);
      push(bucket.dir, hourly.wind_direction_10m, index);
      push(bucket.gust, hourly.wind_gusts_10m, index);
      dayMap.set(date, bucket);
    });

    const days = [...dayMap.values()].map((bucket) => {
      const pressure = avg(bucket.p);
      const windDirectionDegrees = circularMean(bucket.dir);
      return {
        date: bucket.date,
        temperatureMeanC: round(avg(bucket.t)),
        temperatureMinC: round(Math.min(...bucket.t)),
        temperatureMaxC: round(Math.max(...bucket.t)),
        pressureMeanHPa: round(pressure),
        pressureMeanMmHg: Math.round(pressure * 0.750062),
        precipitationSumMm: round(sum(bucket.rain)),
        cloudCoverMeanPercent: Math.round(avg(bucket.cloud)),
        windSpeedMeanMs: round(avg(bucket.wind)),
        windGustMaxMs: round(Math.max(...bucket.gust)),
        windDirection: degreesToCompass(windDirectionDegrees),
        windDirectionDegrees: Math.round(windDirectionDegrees)
      };
    });

    return days.map((day, index) => {
      const prev = days[index - 1];
      const prev3 = days.slice(Math.max(0, index - 3), index);
      const pressureTrend = pressureTrendStats(days, index);
      return {
        ...day,
        pressureChange24hHPa: prev ? round(day.pressureMeanHPa - prev.pressureMeanHPa) : null,
        pressureChange24hMmHg: prev ? round((day.pressureMeanHPa - prev.pressureMeanHPa) * 0.750062) : null,
        pressureAmplitude72hMmHg: pressureTrend.amplitudeMmHg,
        pressureDirectionChanges72h: pressureTrend.directionChanges,
        pressureTrendKind: pressureTrend.kind,
        temperatureChange24hC: prev ? round(day.temperatureMeanC - prev.temperatureMeanC) : null,
        precipitation24hMm: day.precipitationSumMm,
        precipitation72hMm: round(day.precipitationSumMm + sum(prev3.map((item) => item.precipitationSumMm || 0)))
      };
    });
  }

  function pressureTrendStats(days, index) {
    const values = days.slice(Math.max(0, index - 3), index + 1).map((day) => day.pressureMeanMmHg).filter(Number.isFinite);
    if (values.length < 2) return { amplitudeMmHg: 0, directionChanges: 0, kind: "unknown" };
    const amplitudeMmHg = Math.round(Math.max(...values) - Math.min(...values));
    const signs = [];
    for (let i = 1; i < values.length; i += 1) { const d = values[i] - values[i - 1]; if (Math.abs(d) >= 2) signs.push(Math.sign(d)); }
    let directionChanges = 0;
    for (let i = 1; i < signs.length; i += 1) if (signs[i] !== signs[i - 1]) directionChanges += 1;
    let kind = "directional";
    if (amplitudeMmHg <= 2) kind = "stable";
    else if (directionChanges >= 2 && amplitudeMmHg >= 10) kind = "strong_saw";
    else if (directionChanges >= 2 && amplitudeMmHg >= 6) kind = "saw";
    else if (directionChanges >= 1 && amplitudeMmHg >= 3) kind = "unstable";
    return { amplitudeMmHg, directionChanges, kind };
  }

  function buildConditions(weather) {
    return {
      metadata: { version: "0.1", dataType: "online-conditions", modelVersion: "0.4", generatedAt: new Date().toISOString(), source: weather.metadata.source },
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
    const windDirectionChangeDegrees = prevWind ? compassShift(prevWind, day.windDirection) : null;
    const windSpeedChange24hMs = typeof days[index - 1]?.windSpeedMeanMs === "number" ? round(day.windSpeedMeanMs - days[index - 1].windSpeedMeanMs) : null;
    const pressureChange24hHPa = day.pressureChange24hHPa ?? 0;

    const raw = {
      estimatedWaterTemperatureC: waterTemp,
      airTemperatureC: day.temperatureMeanC,
      pressureHPa: day.pressureMeanHPa,
      pressureMmHg: day.pressureMeanMmHg,
      pressureChange24hHPa,
      pressureChange24hMmHg: day.pressureChange24hMmHg ?? round(pressureChange24hHPa * 0.750062),
      pressureAmplitude72hMmHg: day.pressureAmplitude72hMmHg ?? 0,
      pressureDirectionChanges72h: day.pressureDirectionChanges72h ?? 0,
      pressureTrendKind: day.pressureTrendKind || "unknown",
      temperatureChange24hC: day.temperatureChange24hC ?? 0,
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
      waterLevel: level,
      moonPhase: "unknown"
    };

    const factorScores = {
      waterTemperature: scoreWaterTemperature(waterTemp),
      season: scoreSeason(day.date, waterTemp),
      weatherChange: scoreWeatherChange(raw),
      pressure: scorePressure(day.pressureMeanHPa),
      waterClarity: scoreWaterClarity(clarity),
      light: scoreLight(day.cloudCoverMeanPercent, day.date, waterTemp),
      wind: scoreWind(day.windDirection, day.windSpeedMeanMs),
      waterLevel: scoreWaterLevel(level),
      moon: 55
    };

    return { date: day.date, confidence: getConfidence(raw), raw, factorScores, caps: level === "flood_risk" ? ["flood_cap_35"] : [], flags: buildFlags(raw, factorScores) };
  }

  function buildResults(conditions) {
    return {
      metadata: { version: "0.1", dataType: "online-results", modelVersion: "0.4", generatedAt: new Date().toISOString(), source: conditions.metadata.source },
      regions: Object.fromEntries(Object.entries(conditions.regions).map(([regionId, region]) => [
        regionId,
        { summary: region.summary, forecast: region.forecast.map((day) => ({ ...calculateIndex(day), raw: day.raw })) }
      ]))
    };
  }

  function calculateIndex(conditions) {
    const factors = Object.entries(WEIGHTS).map(([id, weight]) => {
      const score = clamp(Number(conditions.factorScores[id] ?? 0), 0, 100);
      return { id, label: LABELS[id], weight, weightPercent: Math.round(weight * 100), score, contribution: round(score * weight, 2), status: score >= 75 ? "помогает" : score >= 50 ? "нейтрально" : "мешает", explanation: factorExplanation(id, score) };
    });
    const indexRaw = factors.reduce((total, factor) => total + factor.contribution, 0);
    const capped = applyCaps(indexRaw, conditions);
    const index = Math.round(capped.index);
    const drivers = getDrivers(factors);
    const rating = getRating(index);
    return { date: conditions.date, index, indexRaw: round(indexRaw, 2), rating, confidence: conditions.confidence || "medium", summary: getSummary(rating, drivers), factors, ...drivers, recommendations: getRecommendations(conditions), warnings: getWarnings(conditions, capped.appliedCaps), appliedCaps: capped.appliedCaps, flags: conditions.flags || [] };
  }

  function estimateWaterTemperature(day, days, index) {
    const current = day.temperatureMeanC ?? 0;
    const previous = days.slice(Math.max(0, index - 3), index).map((item) => item.temperatureMeanC);
    const smoothedAir = avg([current, ...previous].filter(Number.isFinite));
    const profile = seasonalProfile(new Date(`${day.date}T12:00:00`).getMonth() + 1);
    const estimated = profile.baseC + (smoothedAir - profile.referenceAirC) * profile.airWeight + ((day.temperatureMaxC ?? current) - profile.referenceAirC) * profile.currentAirWeight;
    return round(clamp(estimated, profile.minC, profile.maxC));
  }

  function seasonalProfile(month) {
    const profiles = {
      1: [3.2, 2.5, 4.5, -4, .08, .03], 2: [3, 2.5, 4.5, -4, .08, .03], 3: [4.8, 3.5, 6.5, 0, .12, .05], 4: [7, 5.8, 10, 5, .18, .07],
      5: [10, 7.5, 14, 11, .26, .10], 6: [13.5, 9, 17, 16, .30, .12], 7: [15.5, 10, 20.5, 18, .34, .14], 8: [15, 10, 20, 17, .32, .12],
      9: [12, 8, 16.5, 12, .24, .08], 10: [8, 5, 12, 7, .20, .06], 11: [5, 3.5, 8, 2, .14, .04], 12: [3.5, 2.5, 5.5, -2, .10, .03]
    };
    const [baseC, minC, maxC, referenceAirC, airWeight, currentAirWeight] = profiles[month] || profiles[4];
    return { baseC, minC, maxC, referenceAirC, airWeight, currentAirWeight };
  }

  function estimateWaterClarity(day) {
    const p24 = day.precipitation24hMm || 0;
    const p72 = day.precipitation72hMm || 0;
    if (p24 >= 20 || p72 >= 40) return "strongly_muddy";
    if (p24 >= 9 || p72 >= 25) return "moderately_muddy";
    if (p24 >= 3 || p72 >= 10) return "slightly_colored_clear";
    if (p24 > 0 || p72 > 0) return "slightly_tea_clear";
    return "clear";
  }

  function estimateWaterLevel(day) {
    const p24 = day.precipitation24hMm || 0;
    const p72 = day.precipitation72hMm || 0;
    if (p24 >= 25 || p72 >= 50) return "flood_risk";
    if (p24 >= 15 || p72 >= 35) return "high";
    if (p24 >= 6 || p72 >= 18) return "slightly_high";
    if (p72 <= 1) return "slightly_low";
    return "normal";
  }

  function scoreWaterTemperature(temp) { if (temp <= 2) return 20; if (temp <= 5) return interpolate(temp, 3, 5, 30, 50); if (temp <= 9) return interpolate(temp, 6, 9, 60, 80); if (temp <= 15) return 98; if (temp <= 17) return interpolate(temp, 16, 17, 88, 75); if (temp <= 19) return interpolate(temp, 18, 19, 60, 35); return 20; }
  function scoreSeason(date, waterTemp) { const m = new Date(`${date}T12:00:00`).getMonth() + 1; if (m <= 2 || m === 12) return 20; if (m === 3) return 30; if (m === 4) return waterTemp >= 6 ? 55 : 42; if (m === 5) return 86; if (m === 6) return 92; if (m === 7) return waterTemp >= 18 ? 55 : 78; if (m === 8) return waterTemp >= 18 ? 58 : 82; if (m === 9) return 92; if (m === 10) return 78; if (m === 11) return 40; return 50; }
  function scorePressure(hPa) { const mm = hPa * 0.750062; if (mm < 730) return 45; if (mm < 735) return interpolate(mm, 730, 734, 60, 72); if (mm < 742) return interpolate(mm, 735, 741, 75, 88); if (mm <= 758) return interpolate(mm, 742, 758, 90, 100); if (mm <= 765) return interpolate(mm, 759, 765, 88, 76); if (mm <= 772) return interpolate(mm, 766, 772, 75, 60); if (mm <= 780) return interpolate(mm, 773, 780, 58, 45); return 40; }
  function scoreWaterClarity(c) { return { crystal_clear: 78, clear: 88, slightly_tea_clear: 95, slightly_colored_clear: 84, moderately_muddy: 52, strongly_muddy: 22 }[c] ?? 60; }
  function scoreLight(cloud, date, waterTemp) { const m = new Date(`${date}T12:00:00`).getMonth() + 1; if (cloud >= 45 && cloud <= 90) return 92; if (cloud > 90) return 78; if (cloud < 25) { if (m <= 4 || waterTemp <= 6) return 74; if (m >= 7 && m <= 8) return 45; return 58; } return 74; }
  function scoreWind(dir, speed) { const d = { S: 92, SW: 96, W: 94, NW: 66, SE: 62, N: 48, NE: 36, E: 34 }[dir] ?? 65; let s = 75; if (speed <= 1) s = 65; else if (speed <= 4) s = 95; else if (speed <= 7) s = 72; else if (speed <= 10) s = 48; else s = 22; return Math.round(d * .6 + s * .4); }
  function scoreWaterLevel(level) { return { normal: 90, slightly_low: 82, low: 70, critically_low: 35, slightly_high: 82, high: 48, flood_risk: 18 }[level] ?? 75; }
  function scoreWeatherChange(raw) { const p = typeof raw.pressureChange24hMmHg === "number" ? raw.pressureChange24hMmHg : (raw.pressureChange24hHPa ?? 0) * .750062; const temp = Math.abs(raw.temperatureChange24hC ?? 0); const shift = raw.windDirectionChangeDegrees ?? 0; const speedShift = Math.abs(raw.windSpeedChange24hMs ?? 0); const amp = raw.pressureAmplitude72hMmHg ?? 0; const changes = raw.pressureDirectionChanges72h ?? 0; let pressureTrendScore = 92; let stabilityScore = 88; let windScore = 100; let temperatureScore = 92; let precipitationScore = 88; if (Math.abs(p) <= 1) pressureTrendScore = 98; else if (p < -1 && p >= -4) pressureTrendScore = 100; else if (p < -4 && p >= -7) pressureTrendScore = 72; else if (p < -7) pressureTrendScore = 52; else if (p > 1 && p <= 4) pressureTrendScore = 76; else if (p > 4 && p <= 7) pressureTrendScore = 50; else if (p > 7) pressureTrendScore = 28; if (amp <= 2) stabilityScore = 98; else if (raw.pressureTrendKind === "strong_saw" || (changes >= 2 && amp >= 10)) stabilityScore = 25; else if (raw.pressureTrendKind === "saw" || (changes >= 2 && amp >= 6)) stabilityScore = 45; else if (raw.pressureTrendKind === "unstable" || (changes >= 1 && amp >= 3)) stabilityScore = 72; else if (amp >= 10) stabilityScore = 50; else if (amp >= 6) stabilityScore = 68; if (shift >= 135) windScore -= 30; else if (shift >= 90) windScore -= 18; if (speedShift >= 6) windScore -= 24; else if (speedShift >= 4) windScore -= 16; else if (speedShift >= 2.5) windScore -= 8; if ((raw.windGustsMs ?? 0) >= 14) windScore -= 12; if (temp >= 10) temperatureScore = 25; else if (temp >= 7) temperatureScore = 40; else if (temp >= 5) temperatureScore = 60; else if (temp >= 3) temperatureScore = 75; if ((raw.precipitation24hMm ?? 0) >= 25) precipitationScore = 30; else if ((raw.precipitation24hMm ?? 0) >= 15) precipitationScore = 42; else if ((raw.precipitation24hMm ?? 0) >= 9) precipitationScore = 62; else if ((raw.precipitation24hMm ?? 0) >= 3) precipitationScore = 78; return Math.round(clamp(pressureTrendScore * .4 + stabilityScore * .2 + clamp(windScore, 0, 100) * .2 + temperatureScore * .1 + precipitationScore * .1, 0, 100)); }

  function applyCaps(rawIndex, conditions) { const caps = []; const penalties = []; const raw = conditions.raw || {}; if (raw.estimatedWaterTemperatureC >= 20) caps.push({ id: "warm_water_cap_45", limit: 45, reason: "расчетная температура воды выше 20 °C" }); if (raw.estimatedWaterTemperatureC >= 20 && raw.waterLevel === "critically_low") caps.push({ id: "warm_low_water_cap_30", limit: 30, reason: "жара сочетается с критически низким уровнем воды" }); if (raw.waterLevel === "flood_risk" || (conditions.caps || []).includes("flood_cap_35")) penalties.push({ id: "flood_risk_penalty_12", value: 12, reason: "есть признаки паводкового уровня, поэтому индекс снижен мягким штрафом" }); const capped = caps.reduce((value, cap) => Math.min(value, cap.limit), rawIndex); const index = clamp(capped - penalties.reduce((total, penalty) => total + penalty.value, 0), 0, 100); return { index, appliedCaps: [...caps.filter((cap) => cap.limit < rawIndex), ...penalties.filter((penalty) => penalty.value > 0)] }; }
  function getDrivers(factors) { return { positiveDrivers: factors.filter((f) => f.id !== "moon" && f.score >= 80).sort((a, b) => b.contribution - a.contribution).slice(0, 3).map(driver), negativeDrivers: factors.filter((f) => f.id !== "moon" && f.score < 60).sort((a, b) => a.score - b.score || b.weight - a.weight).slice(0, 3).map(driver) }; }
  function driver(f) { return { factor: f.label, score: f.score, reason: f.explanation }; }
  function getRating(index) { if (index <= 25) return "плохо"; if (index <= 50) return "слабо"; if (index <= 70) return "перспективно"; if (index <= 85) return "хорошо"; return "отлично"; }
  function getSummary(rating, drivers) { const best = drivers.positiveDrivers[0]?.factor; const worst = drivers.negativeDrivers[0]?.factor; if (rating === "отлично") return `Очень сильное сочетание условий. Главный плюс: ${best || "несколько ключевых факторов работают в плюс"}.`; if (rating === "хорошо") return `Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: ${best || "стабильный общий фон"}.`; if (rating === "перспективно") return `Есть рабочие условия, но прогноз не без слабых мест. Главный риск: ${worst || "локальные различия воды"}.`; if (rating === "слабо") return `Условия слабые, поездка требует точного выбора места и тактики. Главный минус: ${worst || "несколько факторов против клева"}.`; return `Условия неблагоприятные. Главный минус: ${worst || "сильное сочетание негативных факторов"}.`; }

  function getRecommendations(conditions) {
    const raw = conditions.raw || {};
    const rec = [];
    const clarity = raw.waterClarity;
    const bright = (conditions.flags || []).includes("bright_sun") || (raw.cloudCoverPercent ?? 100) < 30;
    const muddy = clarity === "moderately_muddy" || clarity === "strongly_muddy";
    const stable = (conditions.factorScores?.weatherChange ?? 0) >= 75;
    const activeTemp = (conditions.factorScores?.waterTemperature ?? 0) >= 85;
    const lowWater = raw.waterLevel === "slightly_low" || raw.waterLevel === "low" || (conditions.flags || []).includes("clear_low_water");
    const strongWind = raw.windSpeedMs >= 7;
    const coldWater = raw.estimatedWaterTemperatureC <= 9;
    const veryClear = clarity === "crystal_clear" || clarity === "clear";
    rec.push(timingRecommendation(conditions));
    rec.push(castingRecommendation(conditions));
    if (activeTemp && stable && !muddy && !bright) rec.push("Модель ловли: рыба должна быть достаточно активной. Начни с маленького воблера-минноу или вращающейся блесны, облавливай перекаты, кромки струи и входы в ямы.");
    else if (muddy) rec.push("Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.");
    else if (bright || lowWater || veryClear) rec.push("Модель ловли: форель будет осторожнее обычного. Подходи ниже по течению, держи дистанцию, делай первые забросы издалека и начинай с натуральных воблеров, микроколебалок или мягкой резины без лишнего блеска.");
    else if (coldWater) rec.push("Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.");
    if (clarity === "crystal_clear") rec.push("Приманки: кристально прозрачная вода просит натуральные цвета, маленькие воблеры 30-50 мм, микроколебалки 1.5-3 г и некрупный силикон. Проводка спокойная, без лишней агрессии.");
    if (clarity === "slightly_tea_clear") rec.push("Приманки: слегка чайная прозрачная вода хороша для меди, золота, темных силуэтов, маленьких колебалок и минноу с умеренным контрастом.");
    if (clarity === "moderately_muddy") rec.push("Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.");
    if (clarity === "strongly_muddy") rec.push("Приманки: при сильной мутности используй крупнее силуэт, яркий контраст и вибрацию; при этом общий потенциал ловли низкий.");
    if (strongWind) rec.push("Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.");
    if (["N", "NE", "E"].includes(raw.windDirection)) rec.push("При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.");
    if (lowWater) rec.push("На низкой воде ищи ямки, тень, укрытия и локальные стоянки, не заходи в воду без необходимости.");
    if (coldWater) rec.push("Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.");
    if (!coldWater && !strongWind && !bright && !muddy && raw.windSpeedMs >= 1 && raw.windSpeedMs <= 4) rec.push("Подача: легкая рябь и мягкий свет позволяют ловить активнее: равномерная проводка вращалки или воблера поперек/на снос будет хорошей стартовой схемой.");
    if ((conditions.flags || []).includes("prefrontal_window")) rec.push("Поведение рыбы: плавное снижение давления похоже на предфронтовое окно. При облачности и влажности форель может смелее выходить из укрытий, но следи за мутностью воды.");
    if ((conditions.flags || []).includes("anticyclone_clear")) rec.push("Поведение рыбы: антициклональный сценарий с высоким давлением и ярким светом повышает осторожность. Делай дальние первые забросы, выбирай тень и натуральные цвета.");
    if (stable && (raw.pressureAmplitude72hMmHg ?? 99) <= 2) rec.push("Поведение рыбы: давление стабильно, рыба успевает адаптироваться к фону, поэтому прогноз надежнее, чем при резких скачках.");
    return rec.length ? rec : ["Условия ровные: начни с классической подачи, затем подстраивай размер и цвет под прозрачность воды."];
  }

  function timingRecommendation(conditions) { const raw = conditions.raw || {}; const month = new Date(`${conditions.date}T12:00:00`).getMonth() + 1; const cold = raw.estimatedWaterTemperatureC <= 9; const warm = raw.estimatedWaterTemperatureC >= 18; const bright = (conditions.flags || []).includes("bright_sun") || (raw.cloudCoverPercent ?? 100) < 30; const stable = (conditions.factorScores?.weatherChange ?? 0) >= 75; const soft = (raw.cloudCoverPercent ?? 0) >= 55; if (cold || month <= 4) return "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно."; if (warm || month === 7 || month === 8) return "Когда ловить: лучший выбор - утро; вечером можно пробовать тень и быстрые участки, а середину жаркого дня лучше оценивать осторожно."; if (month >= 9 && month <= 10) return "Когда ловить: осенью можно ловить утром, днем и вечером; важнее стабильное давление, прозрачность воды и отсутствие резкой смены погоды."; if (bright && !soft) return "Когда ловить: при ярком солнце лучше утро или вечер; днем выбирай тень, нависающие берега и закрытые лесом участки."; if (stable && soft) return "Когда ловить: утро, день и вечер рабочие; мягкая облачность и стабильная погода позволяют не привязываться жестко ко времени."; return "Когда ловить: начни с утра или вечера, а днем смещайся к тени, глубине и участкам с более спокойной подачей."; }
  function castingRecommendation(conditions) { const raw = conditions.raw || {}; const clarity = raw.waterClarity; const bright = (conditions.flags || []).includes("bright_sun") || (raw.cloudCoverPercent ?? 100) < 30; const low = raw.waterLevel === "slightly_low" || raw.waterLevel === "low" || (conditions.flags || []).includes("clear_low_water"); const clear = clarity === "crystal_clear" || clarity === "clear"; const tea = clarity === "slightly_tea_clear" || clarity === "slightly_colored_clear"; const muddy = clarity === "moderately_muddy" || clarity === "strongly_muddy"; const ripple = raw.windSpeedMs >= 1 && raw.windSpeedMs <= 4; if ((bright && clear) || (clear && low)) return "Дальность и скрытность: форель, скорее всего, видит рыболова далеко. Первые забросы делай с дальней дистанции, заходи низко и тихо, не выходи на открытый берег до проверки ближних точек."; if (bright || low) return "Дальность и скрытность: осторожность повышена. Начинай издалека, двигайся медленно, используй береговые укрытия и не становись силуэтом на фоне неба."; if (muddy) return "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам."; if (tea || ripple) return "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами."; return "Дальность и скрытность: держи среднюю дистанцию, сначала облавливай ближние перспективные точки, затем переходи к дальним забросам вверх или поперек течения."; }
  function getWarnings(conditions, caps) { const raw = conditions.raw || {}; const warnings = caps.map((cap) => cap.reason); const mm = raw.pressureMmHg ?? Math.round((raw.pressureHPa || 0) * .750062); const delta = raw.pressureChange24hMmHg ?? (raw.pressureChange24hHPa ?? 0) * .750062; if (mm < 730) warnings.push("очень низкое атмосферное давление может указывать на сильный циклональный режим"); if (delta <= -7) warnings.push("давление резко падает, это может дать короткое окно активности и последующий провал"); if (delta >= 7) warnings.push("давление резко растет после смены погоды, это неблагоприятный сигнал"); if (raw.pressureTrendKind === "saw" || raw.pressureTrendKind === "strong_saw") warnings.push(`давление идет пилой: амплитуда ${raw.pressureAmplitude72hMmHg ?? "?"} мм за 48-72 ч и ${raw.pressureDirectionChanges72h ?? "?"} смены направления`); if ((raw.windDirectionChangeDegrees ?? 0) >= 90 || Math.abs(raw.windSpeedChange24hMs ?? 0) >= 4) warnings.push("ветер заметно меняется по направлению или силе, погодный режим нестабилен"); if (raw.waterClarity === "strongly_muddy") warnings.push("вода может быть слишком мутной для эффективной визуальной атаки"); if (raw.windSpeedMs >= 8) warnings.push("сильный ветер может мешать забросу и проводке"); if (raw.estimatedWaterTemperatureC >= 20) warnings.push("температура воды может быть стрессовой для форели"); return [...new Set(warnings)]; }
  function factorExplanation(id, score) { if (id === "weatherChange") { if (score >= 80) return "давление и погода меняются в благоприятном или стабильном режиме"; if (score >= 60) return "есть заметные изменения погоды, прогноз требует осторожности"; return "динамика давления, ветра или фронта ухудшает прогноз"; } if (id === "pressure") { if (score >= 75) return "текущий барометрический фон комфортный"; if (score >= 50) return "текущий уровень давления нейтральный или контекстно зависимый"; return "текущий уровень давления неблагоприятен, особенно в сочетании с резкой сменой погоды"; } if (score >= 75) return HINTS[id][0]; if (score < 60) return HINTS[id][1]; return HINTS[id][2]; }
  function buildFlags(raw, scores) { const flags = []; const delta = raw.pressureChange24hMmHg ?? 0; if (scores.weatherChange >= 75) flags.push("stable_weather"); if (Math.abs(delta) <= 1 && (raw.pressureAmplitude72hMmHg ?? 0) <= 2) flags.push("stable_pressure"); if (delta <= -1 && delta >= -4) flags.push("smooth_pressure_fall"); if (delta <= -7) flags.push("sharp_pressure_drop"); if (delta >= 7) flags.push("sharp_pressure_rise"); if (raw.pressureTrendKind === "saw" || raw.pressureTrendKind === "strong_saw") flags.push("pressure_saw"); if (delta < -1 && raw.cloudCoverPercent >= 60) flags.push("prefrontal_window"); if ((raw.pressureMmHg ?? 0) >= 766 && raw.cloudCoverPercent < 30) flags.push("anticyclone_clear"); if ((raw.windDirectionChangeDegrees ?? 0) >= 90) flags.push("wind_direction_shift"); if (Math.abs(raw.windSpeedChange24hMs ?? 0) >= 4) flags.push("wind_speed_shift"); if (raw.cloudCoverPercent < 30) flags.push("bright_sun"); if (raw.cloudCoverPercent >= 70) flags.push("cloudy"); if (["S", "SW", "W"].includes(raw.windDirection)) flags.push("favorable_wind"); if (["N", "NE", "E"].includes(raw.windDirection)) flags.push("unfavorable_wind"); if (raw.windGustsMs >= 12) flags.push("strong_gusts"); if (raw.waterClarity === "slightly_tea_clear") flags.push("tea_clear_water"); if (raw.waterClarity === "moderately_muddy") flags.push("muddy_risk"); if (raw.waterClarity === "strongly_muddy") flags.push("strong_muddy_risk"); if (raw.waterLevel === "flood_risk") flags.push("flood_risk"); if (raw.waterLevel === "slightly_low") flags.push("clear_low_water"); return flags; }
  function getConfidence(raw) { if (raw.waterClarity === "strongly_muddy" || raw.waterLevel === "flood_risk") return "low"; if (raw.precipitation72hMm >= 18) return "low"; return "medium"; }
  function isTodayOrFuture(date) { const now = new Date(); const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; return date >= today; }
  function push(target, values, index) { const value = Array.isArray(values) ? values[index] : null; if (typeof value === "number" && Number.isFinite(value)) target.push(value); }
  function sum(values) { return values.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0); }
  function avg(values) { const numeric = values.filter(Number.isFinite); return numeric.length ? sum(numeric) / numeric.length : 0; }
  function round(value, digits = 1) { const m = 10 ** digits; return Math.round(value * m) / m; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function interpolate(value, inMin, inMax, outMin, outMax) { return Math.round(outMin + clamp((value - inMin) / (inMax - inMin), 0, 1) * (outMax - outMin)); }
  function degreesToCompass(degrees) { const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]; return dirs[Math.round((((degrees % 360) + 360) % 360) / 45) % dirs.length]; }
  function circularMean(degreesList) { if (!degreesList.length) return 0; const radians = degreesList.map((d) => d * Math.PI / 180); const sin = avg(radians.map(Math.sin)); const cos = avg(radians.map(Math.cos)); return ((Math.atan2(sin, cos) * 180 / Math.PI) % 360 + 360) % 360; }
  function compassShift(a, b) { const degrees = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 }; const diff = Math.abs((degrees[a] ?? 0) - (degrees[b] ?? 0)); return Math.min(diff, 360 - diff); }

  window.fetchOnlineResults = fetchOnlineResults;
})();
