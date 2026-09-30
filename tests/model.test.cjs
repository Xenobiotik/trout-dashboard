const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const engine = require("../app/online-engine");
const cache = require("../app/data-cache");
const locations = require("../app/custom-location");
const adapter = require("../src/weatherAdapter");
const NOW = new Date("2026-09-28T09:00:00Z");

function fixture(overrides = {}) {
  const hourly = { time: [], temperature_2m: [], pressure_msl: [], precipitation: [], cloud_cover: [], wind_speed_10m: [], wind_direction_10m: [], wind_gusts_10m: [] };
  for (let i = 0; i < 216; i++) {
    hourly.time.push(new Date(Date.UTC(2026, 8, 24, i)).toISOString().slice(0, 16));
    const defaults = { temperature_2m: 10, pressure_msl: 750 / .750062, precipitation: 0, cloud_cover: 70, wind_speed_10m: 2, wind_direction_10m: 225, wind_gusts_10m: 3 };
    for (const [key, value] of Object.entries(defaults)) hourly[key].push(key in overrides ? overrides[key](i) : value);
  }
  return hourly;
}

function conditions(overrides = {}) {
  const days = engine.buildDailyForecast(fixture(overrides), NOW);
  return engine.buildDayConditions(days[4], 4, days);
}

function dataset() {
  const days = engine.buildDailyForecast(fixture(), NOW);
  const forecast = days.slice(4).map((day, i) => {
    const c = engine.buildDayConditions(day, i + 4, days);
    return { ...engine.calculateIndex(c), raw: c.raw };
  });
  return { metadata: { modelVersion: engine.MODEL_VERSION, generatedAt: NOW.toISOString() }, regions: Object.fromEntries(engine.REGIONS.map(({ id }) => [id, { forecast, summary: "" }])) };
}

test("weights remain exactly the agreed 100%", () => {
  assert.deepEqual(engine.FACTOR_WEIGHTS, { waterTemperature: .30, season: .20, weatherChange: .15, waterClarity: .12, light: .12, waterLevel: .06, wind: .05 });
  assert.equal(Math.round(Object.values(engine.FACTOR_WEIGHTS).reduce((a, b) => a + b, 0) * 100), 100);
});

test("72 hourly rain buckets, not 96; exact reference endpoint", () => {
  const days = engine.buildDailyForecast(fixture({ precipitation: () => 1 }), NOW);
  assert.equal(days[4].precipitation72hMm, 72);
  assert.equal(days[4].precipitation24hMm, 24);
  assert.equal(days[4].referenceAt, NOW.toISOString());
  assert.equal(days[5].referenceAt, "2026-09-29T09:00:00.000Z");
});

test("rain at reference minus 72h is excluded; reference rain is included", () => {
  assert.equal(conditions({ precipitation: (i) => i === 36 ? 60 : 0 }).raw.precipitation72hMm, 0);
  assert.equal(conditions({ precipitation: (i) => i === 37 ? 2 : i === 108 ? 3 : 0 }).raw.precipitation72hMm, 5);
  assert.equal(conditions({ precipitation: (i) => i === 109 ? 60 : 0 }).raw.precipitation72hMm, 0);
  const result = engine.calculateIndex(conditions({ precipitation: (i) => i === 24 ? 60 : 0 }));
  assert.equal(result.appliedCaps.length, 0);
});

test("missing rain is not dry weather", () => {
  const c = conditions({ precipitation: (i) => i === 100 ? null : 0 });
  assert.equal(c.raw.precipitation72hMm, null);
  assert.equal(c.raw.waterClarity, null);
  assert.equal(c.raw.waterLevel, null);
  assert.equal(engine.calculateIndex(c).index, null);
});

test("all-null pressure has no score, no fake zero, no stability", () => {
  const c = conditions({ pressure_msl: () => null });
  assert.equal(c.raw.pressureHPa, null);
  assert.equal(c.raw.pressureChange24hMmHg, null);
  assert.equal(c.raw.pressureAmplitude72hMmHg, null);
  assert.equal(Object.hasOwn(c.factorScores, "pressure"), false);
  assert.equal(c.factorScores.weatherChange, null);
  assert.equal(c.confidence, "low");
  assert.ok(!c.flags.includes("stable_pressure"));
  const result = engine.calculateIndex(c);
  assert.equal(result.index, null);
  assert.equal(result.positiveDrivers.length, 0);
  assert.ok(result.factors.some((f) => f.id === "weatherChange" && f.contribution === null));
});

test("invalid ranges are missing values rather than valid weather", () => {
  const c = conditions({ pressure_msl: () => 0, temperature_2m: () => 100, cloud_cover: () => -1 });
  assert.equal(c.raw.pressureHPa, null);
  assert.equal(c.raw.estimatedWaterTemperatureC, null);
  assert.equal(c.raw.cloudCoverPercent, null);
  assert.equal(engine.calculateIndex(c).index, null);
});

test("pressure saw survives identical daily means", () => {
  const c = conditions({ pressure_msl: (i) => (i % 24 < 12 ? 744 : 756) / .750062 });
  assert.equal(c.raw.pressureTrendKind, "strong_saw");
  assert.equal(c.raw.pressureAmplitude72hMmHg, 12);
  assert.ok(c.raw.pressureDirectionChanges72h >= 2);
  assert.ok(!c.flags.includes("stable_weather"));
});

test("small oscillations and isolated spikes are not a saw", () => {
  assert.equal(engine.pressureTrendStats(Array.from({ length: 73 }, (_, i) => 750 + i % 2 * 2)).kind, "stable");
  assert.equal(engine.pressureTrendStats(Array.from({ length: 73 }, (_, i) => i === 30 ? 765 : 750)).kind, "stable");
  assert.equal(engine.pressureTrendStats(Array.from({ length: 73 }, (_, i) => 750 + Math.sin(i) * 1)).directionChanges, 0);
});

test("monotonic 11 mm decline has net minus 11 and no reversals", () => {
  const p = engine.pressureTrendStats(Array.from({ length: 73 }, (_, i) => 760 - i * 11 / 72));
  assert.equal(p.netChangeMmHg, -11);
  assert.equal(p.directionChanges, 0);
  assert.equal(p.kind, "directional");
});

test("missing pressure inside the 72h series cannot mean stable", () => {
  const series = Array(73).fill(750); series[20] = null;
  assert.equal(engine.pressureTrendStats(series).kind, "unknown");
});

test("duplicate timestamps fail validation", () => {
  const h = fixture(); h.time[1] = h.time[0];
  assert.throws(() => engine.buildDailyForecast(h, NOW), /Повтор/);
});

test("incomplete day lowers confidence", () => {
  const c = conditions({ cloud_cover: (i) => i === 100 ? null : 70 });
  assert.equal(c.raw.cloudCoverPercent, 70);
  assert.equal(c.confidence, "low");
});

for (const [delta, kind] of [[-8, "sharp_fall"], [-7, "sharp_fall"], [-4, "smooth_fall"], [-1, "stable"], [1, "stable"], [4, "smooth_rise"], [7, "sharp_rise"], [8, "sharp_rise"]]) {
  test(`pressure threshold ${delta}: consistent classifier, flags and recommendations`, () => {
    const c = conditions(); c.raw.pressureChange24hMmHg = delta;
    assert.equal(engine.classifyPressure(c.raw), kind);
    c.flags = engine.buildFlags(c.raw);
    c.factorScores.weatherChange = engine.scoreWeatherChange(c.raw);
    const r = engine.calculateIndex(c);
    if (Math.abs(delta) >= 7) {
      assert.ok(!c.flags.includes("prefrontal_window"));
      assert.ok(!r.recommendations.join(" ").includes("плавное снижение"));
      assert.ok(r.warnings.some((s) => s.includes("резко")));
    }
  });
}

test("prefrontal window excluded by wind, mud or saw", () => {
  const base = conditions().raw;
  const raw = { ...base, pressureChange24hMmHg: -2 };
  assert.ok(engine.isPrefrontalWindow(raw));
  for (const override of [{ windDirectionChangeDegrees: 180 }, { windSpeedChange24hMs: 5 }, { waterClarity: "strongly_muddy" }, { pressureTrendKind: "saw" }, { windGustsMs: null }]) assert.ok(!engine.isPrefrontalWindow({ ...raw, ...override }));
});

test("season and water are continuous across all month boundaries including new year", () => {
  for (let m = 0; m < 12; m++) {
    const dates = [-1, 0, 1].map((offset) => new Date(Date.UTC(2026, m, 1 + offset)).toISOString().slice(0, 10));
    const days = dates.map((date) => ({ date, temperatureMeanC: 10, temperatureMaxC: 10 }));
    const water = days.map((d, i) => engine.estimateWaterTemperature(d, days, i));
    const season = dates.map((d, i) => engine.scoreSeason(d, water[i]));
    assert.ok(Math.abs(water[1] - water[0]) <= .4, dates.join(","));
    assert.ok(Math.abs(season[1] - season[0]) <= 3, dates.join(","));
  }
  assert.ok(engine.scoreWaterTemperature(9.1) - engine.scoreWaterTemperature(9) <= 2);
});

test("cold-water priority excludes active presentation advice", () => {
  const c = conditions(); c.raw.estimatedWaterTemperatureC = 7;
  c.factorScores.waterTemperature = engine.scoreWaterTemperature(7);
  const text = engine.calculateIndex(c).recommendations.join(" ");
  assert.ok(text.includes("вода холодная"));
  assert.ok(!text.includes("ловить активнее"));
});

test("mixed unstable conditions still include a complete fishing approach", () => {
  const c = conditions();
  Object.assign(c.raw, { estimatedWaterTemperatureC: 11, pressureChange24hMmHg: 8, waterClarity: "slightly_tea_clear", cloudCoverPercent: 40, waterLevel: "normal" });
  const recommendations = engine.calculateIndex(c).recommendations;
  assert.ok(recommendations.some((s) => s.startsWith("Модель ловли:")));
  assert.ok(!recommendations.some((s) => s.includes("ловить активнее")));
});

test("a high composite weather score is not described as guaranteed stability", () => {
  const c = conditions();
  c.raw.windDirectionChangeDegrees = 135;
  c.factorScores.weatherChange = engine.scoreWeatherChange(c.raw);
  const f = engine.calculateIndex(c).factors.find((item) => item.id === "weatherChange");
  assert.ok(f.score >= 80);
  assert.ok(!f.explanation.includes("стабильном режиме"));
  assert.ok(!engine.isStableWeather(c.raw));
});

test("heat and flood warnings do not apply additional penalties or caps", () => {
  const c = conditions();
  c.raw.waterLevel = "flood_risk";
  const r = engine.calculateIndex(c);
  assert.equal(r.index, Math.round(r.indexRaw));
  assert.deepEqual(r.appliedCaps, []);
  assert.ok(r.warnings.some((w) => w.includes("паводок")));
  assert.ok(r.recommendations.join(" ").includes("безопасность"));
  assert.ok(!r.recommendations.join(" ").includes("активную подачу"));
  c.raw.estimatedWaterTemperatureC = 21;
  c.raw.waterLevel = "critically_low";
  const warm = engine.calculateIndex(c);
  assert.equal(warm.index, Math.round(warm.indexRaw));
  assert.deepEqual(warm.appliedCaps, []);
  assert.ok(warm.warnings.some((w) => w.includes("тепловой стресс")));
  assert.ok(warm.recommendations.join(" ").includes("отложить ловлю"));
});

test("moon and absolute pressure have no independent factor or hidden constant", () => {
  const c = conditions();
  const baseline = engine.calculateIndex(c);
  const r = engine.calculateIndex({ ...c, factorScores: { ...c.factorScores, pressure: 0, moon: 100 } });
  assert.equal(r.factors.length, 7);
  assert.ok(!r.factors.some((f) => ["moon", "pressure"].includes(f.id)));
  assert.equal(r.indexRaw, baseline.indexRaw);
  assert.ok(![...r.positiveDrivers, ...r.negativeDrivers].some((f) => ["Луна", "Атмосферное давление"].includes(f.factor)));
});

test("all seven equal scores reproduce the same total, without bonuses or caps", () => {
  for (const score of [0, 25, 50, 60, 80, 100]) {
    const c = conditions();
    c.factorScores = Object.fromEntries(Object.keys(engine.FACTOR_WEIGHTS).map((id) => [id, score]));
    const result = engine.calculateIndex(c);
    assert.equal(result.indexRaw, score);
    assert.equal(result.index, score);
    assert.equal(result.factors.length, 7);
  }
});

test("rounding the displayed sum at .50 is not corrupted by binary floating point", () => {
  const c = conditions();
  c.factorScores = { waterTemperature: 76, season: 94, weatherChange: 42, waterClarity: 3, light: 32, waterLevel: 90, wind: 80 };
  const result = engine.calculateIndex(c);
  assert.equal(result.indexRaw, 61.5);
  assert.equal(result.index, 62);
  const data = dataset();
  data.regions.south_west.forecast[0] = { ...result, raw: c.raw };
  assert.ok(cache.usableData(data, NOW));
});

test("timing advice follows water and light without making pressure decisive", () => {
  const c = conditions();
  const text = engine.calculateIndex(c).recommendations.find((r) => r.startsWith("Когда ловить:"));
  assert.ok(!text.includes("давление"));
  c.raw.estimatedWaterTemperatureC = 7;
  assert.ok(engine.calculateIndex(c).recommendations.find((r) => r.startsWith("Когда ловить:")).includes("прогреться"));
  c.date = "2026-04-15";
  c.raw.estimatedWaterTemperatureC = 18;
  assert.ok(engine.calculateIndex(c).recommendations.find((r) => r.startsWith("Когда ловить:")).includes("прохладного утра"));
});

test("stable absolute pressure from 720 to 790 mm has no effect on index", () => {
  const baseline = engine.calculateIndex(conditions());
  for (const mm of [720, 730, 745, 760, 775, 790]) {
    const c = conditions({ pressure_msl: () => mm / .750062 });
    const result = engine.calculateIndex(c);
    assert.equal(result.indexRaw, baseline.indexRaw);
    assert.deepEqual(result.factors, baseline.factors);
    assert.deepEqual(result.recommendations, baseline.recommendations);
    assert.ok(!result.warnings.some((w) => w.includes("низкое атмосферное")));
  }
});

test("pressure dynamics occupy at most five index points and cannot alter other weather components", () => {
  const c = conditions();
  const totals = [];
  const baseline = engine.scoreWeatherComponents(c.raw);
  for (const delta of [-20, -8, -4, -1, 0, 1, 4, 8, 20]) {
    for (const kind of ["stable", "directional", "unstable", "saw", "strong_saw"]) {
      const raw = { ...c.raw, pressureChange24hMmHg: delta, pressureAmplitude72hMmHg: Math.abs(delta) + 2, pressureTrendKind: kind };
      const components = engine.scoreWeatherComponents(raw);
      assert.equal(components.temperature, baseline.temperature);
      assert.equal(components.wind, baseline.wind);
      assert.ok(components.pressure >= 0 && components.pressure <= 100);
      const result = engine.calculateIndex({ ...c, raw, factorScores: { ...c.factorScores, weatherChange: engine.scoreWeatherChange(raw) } });
      totals.push(result.indexRaw);
    }
  }
  assert.ok(Math.max(...totals) - Math.min(...totals) <= 5);
});

test("weather component is exactly the mean of pressure, temperature and wind dynamics", () => {
  const raw = { ...conditions().raw, pressureChange24hMmHg: 8, pressureTrendKind: "saw", pressureAmplitude72hMmHg: 8, temperatureChange24hC: 8, windDirectionChangeDegrees: 180, windSpeedChange24hMs: 6 };
  const parts = engine.scoreWeatherComponents(raw);
  assert.equal(parts.temperature, 40);
  assert.equal(parts.wind, 46);
  assert.equal(engine.scoreWeatherChange(raw), Math.round((parts.pressure + parts.temperature + parts.wind) / 3 * 100) / 100);
});

test("rain and current gusts do not produce an extra weather dynamics penalty", () => {
  const raw = conditions().raw;
  const score = engine.scoreWeatherChange(raw);
  for (const rain of [0, 10, 25, 50, null]) {
    assert.equal(engine.scoreWeatherChange({ ...raw, precipitation24hMm: rain, precipitation72hMm: rain, windGustsMs: 25 }), score);
  }
  assert.ok(engine.scoreWind(2, 25) < engine.scoreWind(2, 3));
});

test("season is a calendar food background independent of current water temperature", () => {
  for (let month = 1; month <= 12; month++) {
    const date = `2026-${String(month).padStart(2, "0")}-15`;
    assert.equal(engine.scoreSeason(date, 3), engine.scoreSeason(date, 21));
  }
  assert.equal(engine.scoreSeason("2026-04-15"), 55);
  assert.equal(engine.scoreSeason("2026-07-15"), 78);
  assert.equal(engine.scoreSeason("2026-08-15"), 82);
});

test("equally steady winds have identical scores regardless of compass direction", () => {
  const baseline = engine.calculateIndex(conditions());
  for (const direction of [0, 45, 90, 135, 180, 225, 270, 315]) {
    const result = engine.calculateIndex(conditions({ wind_direction_10m: () => direction }));
    assert.equal(result.indexRaw, baseline.indexRaw);
    assert.deepEqual(result.recommendations, baseline.recommendations);
    assert.ok(!result.flags.some((f) => /^(un)?favorable_wind$/.test(f)));
  }
});

test("wind score decreases with sustained wind or gusts and requires both inputs", () => {
  for (let speed = 1; speed <= 30; speed++) assert.ok(engine.scoreWind(speed, 35) <= engine.scoreWind(speed - 1, 35));
  for (let gust = 1; gust <= 30; gust++) assert.ok(engine.scoreWind(2, gust) <= engine.scoreWind(2, gust - 1));
  assert.equal(engine.scoreWind(null, 3), null);
  assert.equal(engine.scoreWind(2, null), null);
});

test("missing gusts are unavailable wind, not invented calm, while dynamics stay available", () => {
  const c = conditions({ wind_gusts_10m: () => null });
  assert.equal(c.factorScores.wind, null);
  assert.ok(Number.isFinite(c.factorScores.weatherChange));
  assert.equal(engine.calculateIndex(c).index, null);
});

test("cache rejects obsolete factor sets, false weights, arithmetic and hidden corrections", () => {
  const mutations = [
    (d) => { d.factors.push({ id: "moon", weight: .02, score: 55, contribution: 1.1 }); },
    (d) => { d.factors[0].weight = .22; },
    (d) => { d.factors[0].contribution += 1; },
    (d) => { d.index -= 12; },
    (d) => { d.indexRaw -= 12; },
    (d) => { d.appliedCaps = [{ value: 12 }]; }
  ];
  for (const mutate of mutations) {
    const data = dataset();
    mutate(data.regions.south_west.forecast[0]);
    assert.equal(cache.usableData(data, NOW), null);
  }
  assert.equal(cache.CACHE_KEY, `trout-forecast-v${engine.MODEL_VERSION}`);
});

test("Node pipeline and browser use the same model", () => {
  assert.equal(require("../src/indexModel").calculateIndex, engine.calculateIndex);
  const h = fixture();
  assert.deepEqual(adapter.normalizeOpenMeteoResponse({ hourly: h }, [engine.REGIONS[0]], NOW)[0].forecastDays, engine.buildDailyForecast(h, NOW));
  const context = vm.createContext({ window: {}, URLSearchParams, Date });
  vm.runInContext(fs.readFileSync(require.resolve("../app/online-engine"), "utf8"), context);
  assert.equal(JSON.stringify(context.window.TroutEngine.calculateIndex(conditions())), JSON.stringify(engine.calculateIndex(conditions())));
});

test("five regions and five days reconcile; no NaN or false missing values", () => {
  const data = dataset();
  for (const region of Object.values(data.regions)) {
    assert.equal(region.forecast.length, 5);
    for (const day of region.forecast) {
      assert.ok(Number.isFinite(day.index));
      assert.equal(day.index, Math.round(day.factors.reduce((sum, factor) => sum + factor.contribution, 0)));
    }
  }
});

test("fresh cache works; old April, wrong model, future timestamps rejected", () => {
  const data = dataset();
  assert.ok(cache.usableData(data, NOW));
  for (const metadata of [{ ...data.metadata, generatedAt: "2026-04-29T12:00:00Z" }, { ...data.metadata, modelVersion: "0.5" }, { ...data.metadata, generatedAt: "2026-09-29T12:00:00Z" }]) assert.equal(cache.usableData({ ...data, metadata }, NOW), null);
  assert.equal(cache.usableData(data, new Date(NOW.getTime() + cache.MAX_AGE_MS + 1)), null);
  assert.ok(cache.needsRefresh(data, new Date(NOW.getTime() + cache.REFRESH_MS)));
});

test("bad cache, empty regions and no current date are rejected", () => {
  assert.equal(cache.read({ getItem() { return "{"; } }, NOW), null);
  assert.equal(cache.save({ setItem() { throw Error("quota"); } }, dataset()), false);
  const data = dataset(); data.regions.north.forecast = [];
  assert.equal(cache.usableData(data, NOW), null);
});

test("Moscow date independent of device timezone", () => {
  assert.equal(engine.moscowDate(new Date("2026-09-28T22:00:00Z")), "2026-09-29");
});

test("fetch timeout aborts a hanging request", async () => {
  const original = global.fetch;
  global.fetch = (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(Object.assign(Error("timeout"), { name: "AbortError" }))));
  try { await assert.rejects(engine.fetchJson("https://example.invalid", 5), { name: "AbortError" }); }
  finally { global.fetch = original; }
});

async function mountApp(fetcher, { saved = null, backup = null, blockedStorage = false, point = null, customSaved = null } = {}) {
  let time = NOW.getTime();
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [time])); }
    static now() { return time; }
  }
  const nodes = new Map();
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: "", textContent: "", value: "", dataset: {}, disabled: false, parentElement: { dataset: {} }, style: { setProperty() {} }, classList: { toggle() {} }, handlers: {}, setAttribute() {}, addEventListener(event, handler) { this.handlers[event] = handler; }, querySelectorAll() { return []; } });
    return nodes.get(id);
  }
  const button = node("button"); button.dataset.mode = "live";
  const stored = new Map(saved ? [[cache.CACHE_KEY, JSON.stringify(saved)]] : []);
  if (point) stored.set(locations.STORAGE_KEY, JSON.stringify(point));
  if (customSaved) stored.set(`trout-custom-forecast-v${engine.MODEL_VERSION}`, JSON.stringify(customSaved));
  const document = { visibilityState: "visible", querySelector: node, querySelectorAll: () => [button], addEventListener() {} };
  const window = { LIVE_RESULTS: backup, addEventListener() {}, setInterval() {}, localStorage: { getItem(key) { if (blockedStorage) throw Error("blocked"); return stored.get(key) || null; }, setItem(key, value) { if (blockedStorage) throw Error("blocked"); stored.set(key, value); }, removeItem(key) { if (blockedStorage) throw Error("blocked"); stored.delete(key); } } };
  const context = vm.createContext({ window, document, Date: Clock, Intl, URLSearchParams, console });
  vm.runInContext(fs.readFileSync(require.resolve("../app/online-engine"), "utf8"), context);
  vm.runInContext(fs.readFileSync(require.resolve("../app/data-cache"), "utf8"), context);
  vm.runInContext(fs.readFileSync(require.resolve("../app/custom-location"), "utf8"), context);
  window.fetchOnlineResults = fetcher;
  vm.runInContext(fs.readFileSync(require.resolve("../app/app"), "utf8"), context);
  await vm.runInContext("refreshPromise", context);
  await vm.runInContext("customPromise", context);
  return { node, button, stored, context, advance(ms) { time += ms; } };
}

test("UI: offline first load hides obsolete fallback and keeps retry working", async () => {
  let calls = 0;
  const old = dataset(); old.metadata.generatedAt = "2026-04-29T12:00:00Z";
  const app = await mountApp(async () => { calls++; throw Error("offline"); }, { backup: old });
  assert.ok(app.node("#indexPanel").innerHTML.includes("Нет актуального прогноза"));
  assert.equal(app.button.disabled, false);
  await app.button.handlers.click();
  assert.equal(calls, 2);
});

test("UI: successful response is saved; repeat click really refreshes", async () => {
  let calls = 0;
  const app = await mountApp(async () => { calls++; return dataset(); });
  assert.ok(app.stored.has(cache.CACHE_KEY));
  assert.ok(app.node("#indexPanel").innerHTML.includes("Сумма вкладов"));
  assert.ok(app.node("#dataStatusText").textContent.includes("МСК"));
  await app.button.handlers.click();
  assert.equal(calls, 2);
});

test("UI: seven weights, reference-only pressure and three weather components", async () => {
  const app = await mountApp(async () => dataset());
  const factors = app.node("#factorsList").innerHTML;
  assert.equal((factors.match(/class="factor-row"/g) || []).length, 7);
  for (const weight of [30, 20, 15, 12, 6, 5]) assert.ok(factors.includes(`Вес ${weight}%`));
  assert.ok(!factors.includes("Луна"));
  assert.ok(!factors.includes("Атмосферное давление"));
  assert.ok(factors.includes("Баллы компонентов"));
  assert.ok(factors.includes("порывы"));
  const index = app.node("#indexPanel").innerHTML;
  assert.ok(index.includes("Давление (справочно)"));
  assert.ok(!index.includes("undefined"));
});

test("UI: failed refresh keeps fresh cache with an explicit warning", async () => {
  const app = await mountApp(async () => { throw Error("offline"); }, { saved: dataset() });
  assert.ok(app.node("#dataStatusText").textContent.includes("Сохраненный прогноз"));
  assert.ok(app.node("#indexPanel").innerHTML.includes("Сумма вкладов"));
});

test("UI: expired cache vanishes in an open tab and triggers a retry", async () => {
  let calls = 0;
  const app = await mountApp(async () => { calls++; throw Error("offline"); }, { saved: dataset() });
  app.advance(cache.MAX_AGE_MS + 1);
  vm.runInContext("checkRefresh()", app.context);
  await vm.runInContext("refreshPromise", app.context);
  assert.equal(calls, 2);
  assert.ok(app.node("#indexPanel").innerHTML.includes("Нет актуального прогноза"));
});

test("UI: blocked local storage cannot break online mode", async () => {
  const app = await mountApp(async () => dataset(), { blockedStorage: true });
  assert.ok(app.node("#dataStatusText").textContent.includes("Open-Meteo"));
});

test("UI: unavailable factor has no numeric index or misleading recommendations", async () => {
  const data = dataset();
  const c = conditions({ pressure_msl: () => null });
  data.regions.south_west.forecast[0] = { ...engine.calculateIndex(c), raw: c.raw };
  const app = await mountApp(async () => data);
  assert.ok(app.node("#indexPanel").innerHTML.includes("Индекс недоступен"));
  assert.ok(!app.node("#factorsList").innerHTML.includes("null"));
  assert.ok(app.node("#warningsBlock").innerHTML.includes("Веса не перераспределялись"));
});

test("UI: flood remains visible as a warning, not a subtraction", async () => {
  const data = dataset();
  const c = conditions(); c.raw.waterLevel = "flood_risk";
  const day = { ...engine.calculateIndex(c), raw: c.raw };
  data.regions.south_west.forecast[0] = day;
  const app = await mountApp(async () => data);
  assert.ok(!app.node("#indexPanel").innerHTML.includes("штраф"));
  assert.ok(app.node("#warningsBlock").innerHTML.includes("паводок"));
  assert.ok(app.node("#indexPanel").innerHTML.includes(`итог после округления: ${day.index}`));
});

test("UI: concurrent refreshes share one request", async () => {
  const app = await mountApp(async () => dataset());
  let resolve;
  let calls = 0;
  app.context.window.fetchOnlineResults = () => { calls++; return new Promise((r) => { resolve = r; }); };
  const a = app.button.handlers.click();
  const b = app.button.handlers.click();
  assert.equal(calls, 1);
  assert.equal(app.button.disabled, true);
  resolve(dataset());
  await Promise.all([a, b]);
  assert.equal(app.button.disabled, false);
});

const CUSTOM_KEY = `trout-custom-forecast-v${engine.MODEL_VERSION}`;
const pointA = locations.create("60.557705, 30.253624");
const pointB = locations.create("61.035979, 30.115589");
function customDataset(point = pointA) {
  const data = dataset();
  data.metadata.locations = [{ id: "custom", latitude: point.latitude, longitude: point.longitude }];
  data.regions = { custom: data.regions.south_west };
  return data;
}
function submit(app, coordinates = "60.557705, 30.253624") {
  app.node("#locationCoordinates").value = coordinates;
  return app.node("#locationForm").handlers.submit({ preventDefault() {} });
}

for (const input of ["60.557705, 30.253624", "60.557705 30.253624", "60,557705; 30,253624", " 60,557705 30,253624 ", "60,557705, 30,253624", "+60.557705; +30.253624"]) {
  test(`coordinates: supported format ${input}`, () => {
    assert.deepEqual(locations.parseCoordinates(input), { latitude: 60.557705, longitude: 30.253624 });
  });
}
test("coordinates: reject malformed, extra, out-of-range and out-of-model values", () => {
  for (const input of ["", "60.557705", "60,30,40", "NaN, 30", "Infinity, 30", "91, 30", "60, 181", "60x,30", "60 30 trailing", "60° 30°", "<img>,30"]) assert.throws(() => locations.parseCoordinates(input));
  for (const input of ["30.253624, 60.557705", "-33, 151", "55.75, 37.61"]) assert.throws(() => locations.create(input), /сезонную модель/);
  assert.equal(locations.create("61.8, 33.5").settlement, "Своя точка");
  assert.equal(locations.create("60.123456789, 30.123456789").latitude, 60.123457);
});
test("coordinates: restore validates saved data and storage failures are harmless", () => {
  for (const value of ["{", "null", '{"latitude":null,"longitude":30}', JSON.stringify({ ...pointA, latitude: 91 }), JSON.stringify({ ...pointA, latitude: "60" })]) assert.equal(locations.read({ getItem: () => value }), null);
  assert.deepEqual(locations.read({ getItem: () => JSON.stringify(pointA) }), pointA);
  assert.equal(locations.save({ setItem() { throw Error("blocked"); } }, pointA), false);
  assert.equal(locations.remove({ removeItem() { throw Error("blocked"); } }), false);
});
test("cache: a custom forecast requires exact requested coordinates and remains separate", () => {
  const data = customDataset();
  assert.ok(cache.usableData(data, NOW, [pointA]));
  assert.equal(cache.usableData(data, NOW, [pointB]), null);
  assert.equal(cache.usableData(data, NOW), null);
  assert.equal(cache.usableData(dataset(), NOW, [pointA]), null);
  delete data.metadata.locations;
  assert.equal(cache.usableData(data, NOW, [pointA]), null);
  for (const malformed of ["bad", {}, [null]]) {
    data.metadata.locations = malformed;
    assert.equal(cache.usableData(data, NOW, [pointA]), null);
  }
});
test("engine: custom query uses supplied coordinates, past days, same model and no place name", async () => {
  const original = global.fetch;
  let requested;
  global.fetch = async (url) => { requested = new URL(url); return { ok: true, json: async () => ({ hourly: fixture() }) }; };
  try {
    const data = await engine.fetchOnlineResults([pointA]);
    assert.equal(requested.searchParams.get("latitude"), String(pointA.latitude));
    assert.equal(requested.searchParams.get("longitude"), String(pointA.longitude));
    assert.equal(requested.searchParams.get("past_days"), "4");
    assert.equal(requested.searchParams.get("forecast_days"), "5");
    assert.equal(requested.searchParams.get("timezone"), "Europe/Moscow");
    assert.ok(!requested.href.includes(encodeURIComponent(pointA.settlement)));
    assert.deepEqual(Object.keys(data.regions), ["custom"]);
    assert.deepEqual(data.metadata.locations, [{ id: "custom", latitude: pointA.latitude, longitude: pointA.longitude }]);
    assert.equal(data.metadata.modelVersion, "0.6");
    await assert.rejects(engine.fetchOnlineResults([{ ...pointA, latitude: null }]), /координаты/);
  } finally { global.fetch = original; }
});
test("UI: custom point is calculated, saved and leaves the five regions untouched", async () => {
  const requests = [];
  const app = await mountApp(async (points) => { requests.push(points); return points ? customDataset(points[0]) : dataset(); });
  const original = app.stored.get(cache.CACHE_KEY);
  await submit(app);
  assert.equal(requests.length, 2);
  assert.equal(requests[1][0].latitude, pointA.latitude);
  assert.equal(app.stored.get(cache.CACHE_KEY), original);
  assert.ok(app.stored.has(CUSTOM_KEY));
  assert.ok(app.stored.has(locations.STORAGE_KEY));
  assert.ok(app.node("#indexPanel").innerHTML.includes("Своя точка (60.557705, 30.253624)"));
  assert.equal(vm.runInContext("getCurrentDay().index", app.context), customDataset().regions.custom.forecast[0].index);
  assert.equal(app.node("#customLocation").hidden, false);
  assert.equal((app.node("#regionTabs").innerHTML.match(/data-region=/g) || []).length, 6);
});
test("UI: invalid coordinates leave the current point and forecast unchanged", async () => {
  let calls = 0;
  const app = await mountApp(async (points) => { calls++; return points ? customDataset(points[0]) : dataset(); });
  await submit(app);
  const before = app.node("#indexPanel").innerHTML;
  await submit(app, "30.25, 60.55");
  assert.equal(calls, 2);
  assert.equal(app.node("#indexPanel").innerHTML, before);
  assert.ok(app.node("#locationError").textContent.includes("сначала широта"));
});
test("UI: restored point uses its own fresh offline cache, not a fixed-region forecast", async () => {
  const app = await mountApp(async () => { throw Error("offline"); }, { saved: dataset(), point: pointA, customSaved: customDataset() });
  assert.ok(app.node("#dataStatusText").textContent.includes("Сохраненный прогноз"));
  assert.ok(app.node("#indexPanel").innerHTML.includes("Своя точка (60.557705, 30.253624)"));
  assert.equal(app.node("#locationCoordinates").value, "60.557705, 30.253624");
  const wrong = await mountApp(async () => { throw Error("offline"); }, { saved: dataset(), point: pointB, customSaved: customDataset() });
  assert.ok(wrong.node("#indexPanel").innerHTML.includes("Нет актуального прогноза"));
});
test("UI: failing a new point cannot fall back to the previous point", async () => {
  const app = await mountApp(async (points) => points ? customDataset(points[0]) : dataset());
  await submit(app);
  app.context.window.fetchOnlineResults = async () => { throw Error("offline"); };
  await submit(app, "61.035979, 30.115589");
  assert.ok(app.node("#indexPanel").innerHTML.includes("Нет актуального прогноза"));
  assert.ok(!app.node("#indexPanel").innerHTML.includes("Сосново"));
});
test("UI: legacy place names are ignored while saved coordinates survive", async () => {
  const legacyPoint = { ...pointA, settlement: '<img src=x onerror="alert(1)">' };
  const app = await mountApp(async (points) => points ? customDataset(points[0]) : dataset(), { point: legacyPoint });
  assert.equal(app.node("#locationCoordinates").value, "60.557705, 30.253624");
  assert.ok(app.node("#indexPanel").innerHTML.includes("Своя точка (60.557705, 30.253624)"));
  assert.ok(!app.node("#indexPanel").innerHTML.includes("img"));
  assert.deepEqual(locations.read({ getItem: () => JSON.stringify(legacyPoint) }), pointA);
  for (const file of ["../app/index.html", "../app/app.js"]) {
    assert.ok(!fs.readFileSync(require.resolve(file), "utf8").includes("locationName"));
  }
});
test("UI: custom point remains usable when local storage is blocked", async () => {
  const app = await mountApp(async (points) => points ? customDataset(points[0]) : dataset(), { blockedStorage: true });
  await submit(app);
  assert.ok(app.node("#dataStatusText").textContent.includes("Open-Meteo"));
  assert.ok(app.node("#locationMessage").textContent.includes("не разрешил сохранение"));
});
test("UI: late response cannot restore a deleted point", async () => {
  const app = await mountApp(async () => dataset());
  let resolve;
  app.context.window.fetchOnlineResults = () => new Promise((r) => { resolve = r; });
  const pending = submit(app);
  app.node("#locationRemove").handlers.click();
  resolve(customDataset());
  await pending;
  assert.equal(vm.runInContext("customPoint", app.context), null);
  assert.equal(vm.runInContext("customData", app.context), null);
  assert.equal(app.stored.has(CUSTOM_KEY), false);
  assert.equal(app.stored.has(locations.STORAGE_KEY), false);
  assert.equal(app.node("#locationSubmit").disabled, false);
});
test("UI: newer coordinates win when two point requests finish out of order", async () => {
  const app = await mountApp(async () => dataset());
  const pending = [];
  app.context.window.fetchOnlineResults = () => new Promise((resolve) => pending.push(resolve));
  const first = submit(app);
  const second = submit(app, "61.035979, 30.115589");
  pending[1](customDataset(pointB));
  await second;
  pending[0](customDataset(pointA));
  await first;
  assert.ok(app.node("#indexPanel").innerHTML.includes("Своя точка (61.035979, 30.115589)"));
  assert.equal(JSON.parse(app.stored.get(CUSTOM_KEY)).metadata.locations[0].latitude, pointB.latitude);
});
test("UI: expired custom forecast is hidden and retried without touching regional data", async () => {
  let customCalls = 0;
  const app = await mountApp(async (points) => { if (points) { customCalls++; throw Error("offline"); } return dataset(); }, { point: pointA, customSaved: customDataset() });
  app.advance(cache.MAX_AGE_MS + 1);
  vm.runInContext("checkRefresh()", app.context);
  await vm.runInContext("customPromise", app.context);
  assert.equal(customCalls, 2);
  assert.ok(app.node("#indexPanel").innerHTML.includes("Нет актуального прогноза"));
});
test("UI: refreshing regions in background cannot reset the custom date", async () => {
  const app = await mountApp(async (points) => points ? customDataset(points[0]) : dataset());
  await submit(app);
  vm.runInContext("selectedDayIndex = 3", app.context);
  const date = vm.runInContext("getCurrentDay().date", app.context);
  await vm.runInContext("refreshData()", app.context);
  assert.equal(vm.runInContext("getCurrentDay().date", app.context), date);
  await app.button.handlers.click();
  assert.equal(vm.runInContext("getCurrentDay().date", app.context), date);
});

test("UI: all date formats include the Moscow weekday, even across UTC midnight", async () => {
  const app = await mountApp(async () => dataset());
  assert.match(vm.runInContext('formatDate("2026-10-03")', app.context), /3 окт\.? \(сб\)/);
  assert.equal(vm.runInContext('formatTimestamp("2026-10-02T22:10:00Z")', app.context), "03.10.2026 (сб), 01:10 МСК");
  assert.equal(vm.runInContext('formatTimestamp("2026-12-31T22:00:00Z")', app.context), "01.01.2027 (пт), 01:00 МСК");
  assert.match(vm.runInContext('formatDate("2028-02-29")', app.context), /\(вт\)/);
  assert.equal(vm.runInContext('formatTimestamp(null)', app.context), "нет данных");
  assert.equal(vm.runInContext('formatDate("bad")', app.context), "нет данных");
  assert.match(app.node("#indexPanel").innerHTML, /28 сент\.? \(пн\)/);
  assert.equal((app.node("#forecastStrip").innerHTML.match(/\((пн|вт|ср|чт|пт|сб|вс)\)/g) || []).length, 5);
  assert.match(app.node("#dataStatusText").textContent, /28\.09\.2026 \(пн\)/);
  assert.match(app.node("#factorsList").innerHTML, /28\.09\.2026 \(пн\)/);
});

test("UI: confidence explains estimates and missing data without claiming a success probability", async () => {
  const app = await mountApp(async () => dataset());
  assert.match(app.node("#indexPanel").innerHTML, /Уверенность модели: средняя/);
  assert.match(app.node("#indexPanel").innerHTML, /без измерений в ручье/);
  assert.match(app.node("#indexPanel").innerHTML, /не вероятность улова/);
  for (const override of [{ pressure_msl: () => null }, { temperature_2m: (i) => i === 205 ? null : 10 }]) {
    const c = conditions(override);
    const day = { ...engine.calculateIndex(c), raw: c.raw };
    // Incomplete data is handled even when the final factor score remains available.
    day.confidence = "low";
    day.raw.incompleteDailyData = true;
    app.context.sampleDay = day;
    assert.match(vm.runInContext("getConfidenceExplanation(sampleDay)", app.context), /пропуски/);
  }
  const c = conditions({ precipitation: () => 1 });
  app.context.sampleDay = { ...engine.calculateIndex(c), raw: c.raw };
  assert.match(vm.runInContext("getConfidenceExplanation(sampleDay)", app.context), /осадки.*мутность.*паводка/);
});

test("UI: precautionary spawning windows cover autumn and subsequent incubation", async () => {
  const app = await mountApp(async () => dataset());
  const advice = (date) => vm.runInContext(`getSpawningAdvice("${date}")`, app.context);
  for (const date of ["2026-09-20", "2026-09-30", "2026-10-31", "2026-11-30"]) assert.match(advice(date), /не заходите в воду/);
  for (const date of ["2026-12-01", "2027-01-01", "2027-04-30"]) assert.match(advice(date), /Икра в грунте/);
  for (const date of ["2026-09-19", "2027-05-01", "2026-07-15"]) assert.equal(advice(date), "");
  assert.equal(advice("bad"), "");
  assert.equal(app.node("#spawningAdvice").hidden, false);
  vm.runInContext('appData.regions.south_west.forecast[1].date = "2027-05-01"; selectedDayIndex = 1; render()', app.context);
  assert.equal(app.node("#spawningAdvice").hidden, true);
  vm.runInContext('selectedDayIndex = 0; render()', app.context);
  assert.equal(app.node("#spawningAdvice").hidden, false);
});

test("UI: care remains visible with no weather, custom point, heat and missing data", async () => {
  const html = fs.readFileSync(require.resolve("../app/index.html"), "utf8");
  assert.match(html, /<section class="fishing-care" aria-labelledby=/);
  for (const text of ["ловля ручьевой форели", "запрещена", "не отменяет запрет", "Отпускайте, пожалуйста, рыбу", "одинарные безбородые", "zapadnye.pdf", "severnye.pdf"]) assert.ok(html.includes(text));
  const app = await mountApp(async () => { throw Error("offline"); });
  assert.equal(app.node("#spawningAdvice").hidden, false);
  assert.equal(app.node("#tacticsScope").hidden, true);
  for (const overrides of [{ temperature_2m: () => 35 }, { precipitation: () => 1 }, { pressure_msl: () => null }]) {
    const c = conditions(overrides);
    const data = dataset();
    data.regions.south_west.forecast[0] = { ...engine.calculateIndex(c), raw: c.raw };
    const hot = await mountApp(async () => data);
    assert.equal(hot.node("#spawningAdvice").hidden, false);
    assert.ok(hot.node("#spawningAdvice").textContent.includes("не заходите в воду"));
  }
  const custom = await mountApp(async (points) => points ? customDataset(points[0]) : dataset());
  await submit(custom);
  assert.equal(custom.node("#spawningAdvice").hidden, false);
  assert.equal(custom.node("#tacticsScope").hidden, false);
});
