(function (root, factory) {
  const cache = factory(typeof module === "object" && module.exports ? require("./online-engine") : root.TroutEngine);
  if (typeof module === "object" && module.exports) module.exports = cache;
  else root.TroutCache = cache;
})(typeof window !== "undefined" ? window : globalThis, function (engine) {
  const CACHE_KEY = `trout-forecast-v${engine.MODEL_VERSION}`;
  const FACTOR_COUNT = Object.keys(engine.FACTOR_WEIGHTS).length;
  const REFRESH_MS = 60 * 60 * 1000;
  const MAX_AGE_MS = 6 * REFRESH_MS;

  function usableData(data, now = new Date(), expectedRegions = engine.REGIONS) {
    const generated = Date.parse(data?.metadata?.generatedAt);
    const age = now.getTime() - generated;
    if (!Number.isFinite(generated) || age < -300000 || age > MAX_AGE_MS || data.metadata.modelVersion !== engine.MODEL_VERSION) return null;
    const today = engine.moscowDate(now);
    const lastDate = engine.moscowDate(new Date(now.getTime() + 4 * 86400000));
    const regions = {};
    if (!Array.isArray(expectedRegions) || !expectedRegions.length) return null;
    for (const { id, latitude, longitude } of expectedRegions) {
      if (id === "custom" && (!Array.isArray(data.metadata.locations) || !data.metadata.locations.some((location) => location?.id === id && location.latitude === latitude && location.longitude === longitude))) return null;
      const region = data.regions?.[id];
      if (!Array.isArray(region?.forecast)) return null;
      const forecast = region.forecast.filter((day) => day && day.date >= today && day.date <= lastDate);
      if (!forecast.length || !forecast.some((day) => day.date === today) || new Set(forecast.map((day) => day.date)).size !== forecast.length) return null;
      for (const day of forecast) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Array.isArray(day.factors) || day.factors.length !== FACTOR_COUNT || !day.raw) return null;
        if (!(day.index === null || Number.isFinite(day.index) && day.index >= 0 && day.index <= 100)) return null;
        if (![day.recommendations, day.warnings, day.positiveDrivers, day.negativeDrivers, day.appliedCaps].every(Array.isArray)) return null;
        if (new Set(day.factors.map((factor) => factor?.id)).size !== FACTOR_COUNT || day.appliedCaps.length) return null;
        if (day.factors.some((factor) => !factor || !Object.hasOwn(engine.FACTOR_WEIGHTS, factor.id) || factor.weight !== engine.FACTOR_WEIGHTS[factor.id]
          || !(factor.score === null || Number.isFinite(factor.score) && factor.score >= 0 && factor.score <= 100)
          || !(factor.contribution === null || Number.isFinite(factor.contribution)))) return null;
        if (day.factors.some((factor) => factor.score === null) !== (day.index === null)) return null;
        if (day.factors.some((factor) => factor.score === null ? factor.contribution !== null
          : factor.contribution !== Math.round(factor.score * factor.weight * 100) / 100)) return null;
        const total = Math.round(day.factors.reduce((sum, factor) => sum + (factor.contribution ?? 0), 0) * 100) / 100;
        if (day.index !== null && (day.index !== Math.round(total) || day.indexRaw !== total)) return null;
      }
      regions[id] = { ...region, forecast: [...forecast].sort((a, b) => a.date.localeCompare(b.date)) };
    }
    return { ...data, regions };
  }

  function read(storage, now, expectedRegions, key = CACHE_KEY) {
    try { return usableData(JSON.parse(storage.getItem(key)), now, expectedRegions); }
    catch { return null; }
  }

  function save(storage, data, key = CACHE_KEY) {
    try { storage.setItem(key, JSON.stringify(data)); return true; }
    catch { return false; }
  }

  function needsRefresh(data, now = new Date(), expectedRegions = engine.REGIONS) {
    return !usableData(data, now, expectedRegions) || now.getTime() - Date.parse(data.metadata.generatedAt) >= REFRESH_MS
      || engine.moscowDate(new Date(data.metadata.generatedAt)) !== engine.moscowDate(now)
      || !data.regions[expectedRegions[0].id].forecast.some((day) => day.date === engine.moscowDate(now));
  }

  return { CACHE_KEY, REFRESH_MS, MAX_AGE_MS, usableData, read, save, needsRefresh };
});
