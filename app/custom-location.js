(function (root, factory) {
  const locations = factory();
  if (typeof module === "object" && module.exports) module.exports = locations;
  else root.TroutLocation = locations;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const STORAGE_KEY = "trout-custom-place-v1";

  function parseCoordinates(value) {
    const input = String(value).trim();
    const match = input.match(/^([+-]?\d+(?:[.,]\d+)?)\s*;\s*([+-]?\d+(?:[.,]\d+)?)$/)
      || input.match(/^([+-]?\d+(?:[.,]\d+)?)(?:,\s+|\s+,?\s*)([+-]?\d+(?:[.,]\d+)?)$/)
      || input.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
    if (!match) throw new Error("Нужны две координаты: широта, затем долгота. Например: 60.557705, 30.253624.");
    const [latitude, longitude] = match.slice(1).map((part) => Number(part.replace(",", ".")));
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      throw new Error("Широта должна быть от −90 до 90, долгота от −180 до 180.");
    }
    return { latitude: Math.round(latitude * 1e6) / 1e6, longitude: Math.round(longitude * 1e6) / 1e6 };
  }

  function create(value, name = "") {
    const coordinates = parseCoordinates(value);
    // A conservative operational area, not an administrative or scientific boundary.
    if (coordinates.latitude < 58 || coordinates.latitude > 63 || coordinates.longitude < 27 || coordinates.longitude > 36) {
      throw new Error("Эта версия рассчитана на Ленинградскую область и юг Карелии: рабочая область 58–63° с. ш., 27–36° в. д. Для других широт нужно адаптировать сезонную модель. Проверь также порядок: сначала широта.");
    }
    return { id: "custom", direction: "Своя точка", settlement: String(name).replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 60) || "Моё место", ...coordinates };
  }

  function read(storage) {
    try {
      const point = JSON.parse(storage.getItem(STORAGE_KEY));
      if (!point || !Number.isFinite(point.latitude) || !Number.isFinite(point.longitude) || typeof point.settlement !== "string") return null;
      return create(`${point.latitude}; ${point.longitude}`, point.settlement);
    } catch { return null; }
  }

  function save(storage, point) {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(point)); return true; }
    catch { return false; }
  }

  function remove(storage) {
    try { storage.removeItem(STORAGE_KEY); return true; }
    catch { return false; }
  }

  return { STORAGE_KEY, parseCoordinates, create, read, save, remove };
});
