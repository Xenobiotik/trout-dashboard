const REGION_LABELS = {
  south_west: "Юго-запад (Систо-Палкино)",
  south: "Юг (Сиверский)",
  north_east: "Северо-восток (Сосново)",
  north: "Север (Приозерск)",
  north_west: "Северо-запад (Выборг)"
};

const REGION_SHORT_LABELS = {
  south_west: "ЮЗ (Систо-Палкино)",
  south: "Юг (Сиверский)",
  north_east: "СВ (Сосново)",
  north: "Север (Приозерск)",
  north_west: "СЗ (Выборг)"
};

const WIND_LABELS = {
  N: "северный",
  NE: "северо-восточный",
  E: "восточный",
  SE: "юго-восточный",
  S: "южный",
  SW: "юго-западный",
  W: "западный",
  NW: "северо-западный"
};

const CLARITY_LABELS = {
  crystal_clear: "кристально прозрачная",
  clear: "прозрачная",
  slightly_tea_clear: "слегка чайная прозрачная",
  slightly_colored_clear: "слегка окрашенная прозрачная",
  moderately_muddy: "умеренно мутная",
  strongly_muddy: "сильно мутная"
};

const WATER_LEVEL_LABELS = {
  normal: "нормальный",
  slightly_low: "слегка низкий",
  low: "низкий",
  critically_low: "критически низкий",
  slightly_high: "слегка повышенный",
  high: "высокий",
  flood_risk: "риск паводка"
};

const CONFIDENCE_LABELS = {
  high: "высокая",
  medium: "средняя",
  low: "низкая"
};

let appData;
let onlineData;
let onlineStatus = "idle";
let refreshPromise;
let lastAttempt = 0;
let lastError = "";
let selectedRegionId = "south_west";
let selectedDayIndex = 0;

const elements = {
  regionTabs: document.querySelector("#regionTabs"),
  modeButtons: document.querySelectorAll(".mode-button"),
  dataStatusText: document.querySelector("#dataStatusText"),
  indexPanel: document.querySelector("#indexPanel"),
  positiveDrivers: document.querySelector("#positiveDrivers"),
  negativeDrivers: document.querySelector("#negativeDrivers"),
  forecastStrip: document.querySelector("#forecastStrip"),
  factorsList: document.querySelector("#factorsList"),
  recommendationsList: document.querySelector("#recommendationsList"),
  warningsBlock: document.querySelector("#warningsBlock")
};

function scoreColor(score) {
  if (!Number.isFinite(score)) return "#657066";
  if (score >= 86) return "#1f7a55";
  if (score >= 71) return "#2d6f8f";
  if (score >= 51) return "#b7791f";
  return "#b43a32";
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short"
  }).format(new Date(`${dateString}T12:00:00`));
}

function pressureToMmHg(hPa) {
  if (!Number.isFinite(hPa)) return "-";
  return Math.round(hPa * 0.750062);
}

function windLabel(direction) {
  return WIND_LABELS[direction] || direction || "-";
}

function getSeasonText(dateString, seasonScore) {
  const month = new Date(`${dateString}T12:00:00`).getMonth() + 1;
  if (month >= 5 && month <= 6) {
    return `поздняя весна / начало лета, ожидаемый кормовой фон ${seasonScore}/100`;
  }
  if (month >= 9 && month <= 10) {
    return `осенняя фаза, ожидаемый кормовой фон ${seasonScore}/100; активность на ручье требует наблюдения`;
  }
  if (month >= 7 && month <= 8) {
    return `летний кормовой фон ${seasonScore}/100; температура воды учитывается отдельно`;
  }
  if (month >= 3 && month <= 4) {
    return `весенний переход, ожидаемый кормовой фон ${seasonScore}/100`;
  }
  return `холодный сезон, ожидаемый кормовой фон ${seasonScore}/100; количество корма не измеряется`;
}

function formatDelta(value, unit) {
  if (typeof value !== "number") return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} ${unit}`;
}

function pressureDeltaToMmHg(hPaDelta) {
  if (typeof hPaDelta !== "number") return "-";
  return formatDelta(Math.round(hPaDelta * 0.750062), "мм");
}

function pressureDeltaLabel(raw) {
  if (typeof raw.pressureChange24hMmHg === "number") {
    return formatDelta(raw.pressureChange24hMmHg, "мм");
  }

  return pressureDeltaToMmHg(raw.pressureChange24hHPa);
}

function pressureTrendLabel(raw) {
  const amplitude = raw.pressureAmplitude72hMmHg;
  const netChange = raw.pressureNetChange72hMmHg;
  const changes = raw.pressureDirectionChanges72h;
  if (typeof amplitude !== "number") return "нет данных за 72 ч";

  const netText =
    typeof netChange === "number"
      ? netChange > 0
        ? `за 72 ч: рост на ${netChange} мм`
        : netChange < 0
          ? `за 72 ч: снижение на ${Math.abs(netChange)} мм`
          : "за 72 ч: без итогового сдвига"
      : "за 72 ч: нет данных";

  if (amplitude <= 2) return `${netText}; колебания: почти нет`;
  if (raw.pressureTrendKind === "strong_saw") return `${netText}; сильная пила: размах ${amplitude} мм, смен направления ${changes}`;
  if (raw.pressureTrendKind === "saw") return `${netText}; пила: размах ${amplitude} мм, смен направления ${changes}`;
  if (raw.pressureTrendKind === "unstable") return `${netText}; легкая нестабильность: размах ${amplitude} мм, смен направления ${changes}`;
  return `${netText}; колебания: без пилы`;
}

function getPressureWeatherInterpretation(raw) {
  const engine = window.TroutEngine;
  const kind = engine.classifyPressure(raw);
  const delta = pressureDeltaLabel(raw);
  if (["saw", "strong_saw"].includes(raw.pressureTrendKind)) {
    return `В почасовом ряду есть значимые развороты давления: ${pressureTrendLabel(raw)}. Модель снижает оценку устойчивости погоды.`;
  }
  if (kind === "sharp_rise") return `Резкий рост давления (${delta} за 24 ч) снижает оценку динамики. Это возможный признак смены погодного режима, а не подтверждение антициклона.`;
  if (kind === "sharp_fall") return `Резкое падение давления (${delta} за 24 ч) снижает оценку динамики. Благоприятное окно плавного снижения к этому сценарию не относится.`;
  if (engine.isPrefrontalWindow(raw)) return `Плавное снижение давления (${delta}) сочетается с облачностью и отсутствием сильной смены ветра. Это возможный предфронтовой сценарий; вылет насекомых и усиление клева по этим данным не установлены.`;
  if (["smooth_rise", "moderate_rise"].includes(kind)) return `Давление растет (${delta}). При ясном небе и прозрачной воде осторожность рыбы может возрастать, но одного барометрического тренда для вывода недостаточно.`;
  if (kind === "stable" && raw.pressureTrendKind === "stable") return "Давление за 72 часа без значимых колебаний. Это плюс по правилам модели; ветер, температура и вода оцениваются отдельно.";
  if (["smooth_fall", "moderate_fall"].includes(kind)) return `Давление снижается (${delta}); оценка этого изменения зависит также от ветра, осадков и прозрачности воды.`;
  return "";
}

function formatWindChange(raw) {
  const previous = raw.windDirectionPrevious ? windLabel(raw.windDirectionPrevious) : null;
  const current = raw.windDirection ? windLabel(raw.windDirection) : null;
  const directionChange = raw.windDirectionChangeDegrees;
  const speedChange = raw.windSpeedChange24hMs;
  const parts = [];

  if (previous && current && typeof directionChange === "number") {
    parts.push(`${previous} → ${current} (${Math.round(directionChange)}°)`);
  } else if (current) {
    parts.push(current);
  }

  if (typeof speedChange === "number") {
    parts.push(`скорость ${formatDelta(speedChange, "м/с")}`);
  }

  return parts.length ? parts.join(", ") : "без явной смены";
}

function getFactorPrimaryInfo(factor, day) {
  const raw = day.raw || {};
  const score = factor.score;
  const weather = window.TroutEngine.scoreWeatherComponents(raw);
  const breakdown = weather ? `Баллы компонентов: динамика давления ${weather.pressure}, температуры ${weather.temperature}, ветра ${weather.wind} из 100. Каждый занимает 5% общего веса.` : "Недостаточно данных о погодной динамике.";

  const info = {
    waterTemperature: `${raw.estimatedWaterTemperatureC ?? "-"} °C расчетной температуры воды, воздух ${raw.airTemperatureC ?? "-"} °C`,
    season: getSeasonText(day.date, score),
    weatherChange: `давление за 24 ч: ${pressureDeltaLabel(raw)}, ${pressureTrendLabel(raw)}; ветер (средние за сутки): ${formatWindChange(raw)}; температура воздуха (средние за сутки): ${formatDelta(raw.temperatureChange24hC, "°C")}. Окно давления заканчивается ${formatTimestamp(raw.referenceAt)} и включает прогноз до этого часа. ${breakdown}`,
    waterClarity: `${CLARITY_LABELS[raw.waterClarity] || "нет оценки"} (косвенная оценка); осадки за 24 ч до ${formatTimestamp(raw.referenceAt)}: ${raw.precipitation24hMm ?? "-"} мм`,
    light: `облачность ${raw.cloudCoverPercent ?? "-"}%`,
    wind: `${windLabel(raw.windDirection)}, ${raw.windSpeedMs ?? "-"} м/с, порывы до ${raw.windGustsMs ?? "-"} м/с. Оцениваются сила и порывы, направление дано справочно.`,
    waterLevel: `${WATER_LEVEL_LABELS[raw.waterLevel] || "нет оценки"} (косвенная оценка по осадкам); за 72 ч до ${formatTimestamp(raw.referenceAt)}: ${raw.precipitation72hMm ?? "-"} мм`
  };

  return info[factor.id] || "";
}

function getDetailedAnalytics(day) {
  const raw = day.raw || {};
  const parts = [];
  const factor = Object.fromEntries(day.factors.map((item) => [item.id, item.score]));
  if (day.index === null) return ["Не все факторы доступны. Пропуски не считаются нулевыми значениями, итоговый индекс не рассчитан."];

  if (factor.waterTemperature >= 85 && factor.season >= 85) {
    parts.push(`Температурный фон (${raw.estimatedWaterTemperatureC} °C) хорошо совпадает с сильной сезонной фазой.`);
  } else if (factor.waterTemperature < 70) {
    parts.push(`Температура воды (${raw.estimatedWaterTemperatureC} °C) ограничивает активность, даже если часть остальных факторов выглядит неплохо.`);
  }

  if (window.TroutEngine.isStableWeather(raw)) {
    parts.push("Температура воздуха, ветер и давление меняются без выраженных скачков. Это благоприятный погодный фон по правилам модели.");
  } else if (factor.weatherChange < 60) {
    parts.push(`Погодный переход снижает индекс: динамика ${factor.weatherChange}/100. Уровень давления ${pressureToMmHg(raw.pressureHPa)} мм рт. ст. не получает отдельной оценки.`);
  }

  const pressureInterpretation = getPressureWeatherInterpretation(raw);
  if (pressureInterpretation) {
    parts.push(pressureInterpretation);
  }

  if ((raw.windDirectionChangeDegrees ?? 0) >= 90 || Math.abs(raw.windSpeedChange24hMs ?? 0) >= 4) {
    parts.push(`Смена ветра заметная: ${formatWindChange(raw)}, это снижает стабильность погодного режима.`);
  }

  if (factor.waterClarity >= 80 && factor.light >= 80) {
    parts.push(`Прозрачность воды и мягкий свет работают вместе: рыба видит приманку, но не должна быть чрезмерно настороженной.`);
  } else if (factor.waterClarity < 60) {
    parts.push(`Прозрачность является риском: ${CLARITY_LABELS[raw.waterClarity] || "вода оценена как проблемная"}, поэтому важны контраст и вибрация.`);
  } else if (factor.light < 60) {
    parts.push(`Освещенность ухудшает условия: яркий свет при прозрачной воде повышает осторожность форели.`);
  }

  if (factor.wind >= 80) {
    parts.push(`Сила ветра не создает выраженных помех: ${raw.windSpeedMs} м/с, порывы до ${raw.windGustsMs} м/с. Направление ${windLabel(raw.windDirection)} дано справочно.`);
  } else if (factor.wind < 60) {
    parts.push(`Сила ветра или порывы затрудняют ловлю: ${raw.windSpeedMs} м/с, порывы до ${raw.windGustsMs} м/с.`);
  }

  return parts.slice(0, 4);
}

function getCurrentDay() {
  return appData?.regions[selectedRegionId]?.forecast[selectedDayIndex];
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (!value || !Number.isFinite(date.getTime())) return "нет данных";
  return new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date) + " МСК";
}

function getStoredData() {
  try { return window.TroutCache.read(window.localStorage); }
  catch { return null; }
}

async function refreshData() {
  if (refreshPromise) return refreshPromise;
  const previousDate = getCurrentDay()?.date;
  lastAttempt = Date.now();
  onlineStatus = "loading";
  appData = window.TroutCache.usableData(appData);
  render();
  refreshPromise = (async () => {
    try {
      const data = window.TroutCache.usableData(await window.fetchOnlineResults());
      if (!data) throw new Error("Ответ содержит устаревшие или неполные данные по районам");
      onlineData = data;
      appData = data;
      onlineStatus = "online";
      lastError = "";
      try { window.TroutCache.save(window.localStorage, data); } catch {}
    } catch (error) {
      lastError = error.name === "AbortError" ? "Источник погоды не ответил за 15 секунд." : "Не удалось обновить погоду.";
      const candidates = [onlineData, getStoredData(), window.LIVE_RESULTS]
        .map((data) => window.TroutCache.usableData(data)).filter(Boolean)
        .sort((a, b) => Date.parse(b.metadata.generatedAt) - Date.parse(a.metadata.generatedAt));
      appData = candidates[0] || null;
      onlineStatus = appData ? "fallback" : "error";
    } finally {
      selectedDayIndex = Math.max(0, appData?.regions[selectedRegionId]?.forecast.findIndex((day) => day.date === previousDate) ?? 0);
      refreshPromise = null;
      render();
    }
  })();
  return refreshPromise;
}

function renderModeSwitch() {
  elements.modeButtons.forEach((button) => {
    button.disabled = onlineStatus === "loading";
    button.setAttribute("aria-busy", String(onlineStatus === "loading"));
    button.textContent = onlineStatus === "loading" ? "Обновление..." : "Обновить погоду";
  });
  let label = "Загружаю погоду...";
  if (onlineStatus === "loading" && appData) label = `Обновляю. Предыдущие данные: ${formatTimestamp(appData.metadata.generatedAt)}`;
  else if (onlineStatus === "online") label = `Open-Meteo · обновлено ${formatTimestamp(appData?.metadata.generatedAt)}`;
  else if (onlineStatus === "fallback") label = `${lastError} Сохраненный прогноз от ${formatTimestamp(appData.metadata.generatedAt)}.`;
  else if (onlineStatus === "error") label = `${lastError} Актуального сохраненного прогноза нет.`;
  elements.dataStatusText.textContent = label;
  elements.dataStatusText.parentElement.dataset.status = onlineStatus;
}

function checkRefresh() {
  if (document.visibilityState === "hidden" || refreshPromise) return;
  const previousDates = appData?.regions[selectedRegionId]?.forecast.map((day) => day.date).join(",");
  appData = window.TroutCache.usableData(appData);
  if (previousDates !== appData?.regions[selectedRegionId]?.forecast.map((day) => day.date).join(",")) {
    selectedDayIndex = 0;
    if (!appData) { onlineStatus = "error"; lastError = "Сохраненный прогноз устарел."; }
    render();
  }
  if (window.TroutCache.needsRefresh(appData) && Date.now() - lastAttempt >= 5 * 60000) refreshData();
}

function setupModeSwitch() {
  elements.modeButtons.forEach((button) => button.addEventListener("click", refreshData));
  document.addEventListener("visibilitychange", checkRefresh);
  window.addEventListener("focus", checkRefresh);
  window.addEventListener("online", () => refreshData());
  window.setInterval(checkRefresh, 60000);
}

function renderRegionTabs() {
  elements.regionTabs.innerHTML = Object.keys(REGION_LABELS)
    .map((regionId) => {
      const active = regionId === selectedRegionId ? " active" : "";
      return `<button class="region-tab${active}" type="button" data-region="${regionId}">${REGION_SHORT_LABELS[regionId]}</button>`;
    })
    .join("");

  elements.regionTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRegionId = button.dataset.region;
      selectedDayIndex = 0;
      render();
    });
  });
}

function renderIndexPanel(day) {
  const color = scoreColor(day.index);
  const raw = day.raw || {};

  elements.indexPanel.style.setProperty("--score", day.index ?? 0);
  elements.indexPanel.style.setProperty("--score-color", color);
  elements.indexPanel.innerHTML = `
    <div class="score-ring" aria-label="${day.index === null ? "Индекс недоступен" : `Индекс ${day.index} из 100`}">
      <div class="score-value">
        <strong>${day.index ?? "-"}</strong>
        <span>из 100</span>
      </div>
    </div>
    <div class="index-copy">
      <p class="region-name">${REGION_LABELS[selectedRegionId]} · ${formatDate(day.date)}</p>
      <div class="rating-row">
        <h2>${day.rating}</h2>
        <span class="pill">уверенность: ${CONFIDENCE_LABELS[day.confidence] || day.confidence}</span>
      </div>
      <p class="summary">${day.summary}</p>
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Вода (расчет)</span>
          <span class="meta-value">${raw.estimatedWaterTemperatureC ?? "-"} °C</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Давление (справочно)</span>
          <span class="meta-value">${pressureToMmHg(raw.pressureHPa)} мм рт. ст.</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Ветер</span>
          <span class="meta-value">${windLabel(raw.windDirection)} · ${raw.windSpeedMs ?? "-"} м/с</span>
        </div>
      </div>
      <div class="analytics-block">
        <h3>Почему такая оценка</h3>
        ${renderCalculation(day)}
        <ul>
          ${getDetailedAnalytics(day).map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderCalculation(day) {
  if (!Number.isFinite(day.indexRaw)) return "";
  const number = (value) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value);
  const steps = [`Сумма вкладов: ${number(day.indexRaw)}`];
  steps.push(`итог после округления: ${day.index}`);
  return `<p class="calculation">${steps.join(" → ")}</p>`;
}

function renderDrivers(listElement, drivers, emptyText) {
  if (!drivers.length) {
    listElement.innerHTML = `<li class="empty-state">${emptyText}</li>`;
    return;
  }

  listElement.innerHTML = drivers
    .map(
      (driver) => `
        <li>
          <strong>${driver.factor} · ${driver.score}</strong>
          <span>${driver.reason}</span>
        </li>
      `
    )
    .join("");
}

function renderForecast() {
  const region = appData?.regions[selectedRegionId];
  if (!region) { elements.forecastStrip.innerHTML = '<p class="empty-state">Прогноз пока недоступен.</p>'; return; }
  selectedDayIndex = Math.min(selectedDayIndex, region.forecast.length - 1);

  elements.forecastStrip.innerHTML = region.forecast
    .map((day, index) => {
      const active = index === selectedDayIndex ? " active" : "";
      return `
        <button class="forecast-card${active}" type="button" data-day="${index}">
          <div class="forecast-date">${formatDate(day.date)}</div>
          <div class="forecast-score">
            <strong style="color:${scoreColor(day.index)}">${day.index ?? "-"}</strong>
            <span>/ 100</span>
          </div>
          <div class="forecast-rating">${day.rating}</div>
        </button>
      `;
    })
    .join("");

  elements.forecastStrip.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDayIndex = Number(button.dataset.day);
      render();
    });
  });
}

function renderFactors(day) {
  elements.factorsList.innerHTML = day.factors
    .map((factor) => {
      const color = scoreColor(factor.score);
      return `
        <div class="factor-row">
          <div class="factor-title">
            <strong>${factor.label}</strong>
            <span>Вес ${factor.weightPercent}% · вклад ${factor.contribution ?? "нет оценки"}</span>
            <em>${getFactorPrimaryInfo(factor, day)}</em>
          </div>
          <div class="factor-score" style="color:${color}">${factor.score ?? "-"}</div>
          <div>
            <div class="bar-track">
              <div class="bar-fill" style="--width:${factor.score ?? 0}%; --bar-color:${color}"></div>
            </div>
            <div class="factor-note">${factor.status}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderRecommendations(day) {
  elements.warningsBlock.innerHTML = day.warnings.length
    ? `<div class="warnings">${day.warnings.map((warning) => `<div class="warning">${warning}</div>`).join("")}</div>`
    : "";

  elements.recommendationsList.innerHTML = day.recommendations
    .map((recommendation) => `<li>${recommendation}</li>`)
    .join("");
}

function render() {
  renderModeSwitch();
  renderRegionTabs();
  renderForecast();
  const day = getCurrentDay();
  if (!day) {
    elements.indexPanel.innerHTML = `<div class="index-copy"><h2>${onlineStatus === "loading" ? "Загружаю свежую погоду" : "Нет актуального прогноза"}</h2><p class="summary">${onlineStatus === "loading" ? "" : "Старые оценки скрыты. Повтори обновление после восстановления связи."}</p></div>`;
    elements.positiveDrivers.innerHTML = '<li class="empty-state">Нет актуальных данных.</li>';
    elements.negativeDrivers.innerHTML = '<li class="empty-state">Нет актуальных данных.</li>';
    elements.factorsList.innerHTML = '<p class="empty-state">Оценки появятся после загрузки погоды.</p>';
    elements.recommendationsList.innerHTML = "";
    elements.warningsBlock.innerHTML = "";
    return;
  }
  renderIndexPanel(day);
  renderDrivers(elements.positiveDrivers, day.positiveDrivers, "Выраженных плюсов нет.");
  renderDrivers(elements.negativeDrivers, day.negativeDrivers, "Выраженных рисков нет.");
  renderFactors(day);
  renderRecommendations(day);
}

async function init() {
  setupModeSwitch();
  appData = getStoredData();
  await refreshData();
}

init();
