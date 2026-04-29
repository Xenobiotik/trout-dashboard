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

const MOON_LABELS = {
  waxing_crescent: "растущий серп",
  first_quarter: "первая четверть",
  waxing_gibbous: "растущая луна"
};

const CONFIDENCE_LABELS = {
  high: "высокая",
  medium: "средняя",
  low: "низкая"
};

let appData;
let dataMode = "live";
let onlineData;
let onlineStatus = "idle";
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
  if (typeof hPa !== "number") return "-";
  return Math.round(hPa * 0.750062);
}

function windLabel(direction) {
  return WIND_LABELS[direction] || direction || "-";
}

function getSeasonText(dateString, seasonScore) {
  const month = new Date(`${dateString}T12:00:00`).getMonth() + 1;
  if (month >= 5 && month <= 6) {
    return `поздняя весна / начало лета, сезонный балл ${seasonScore}`;
  }
  if (month >= 9 && month <= 10) {
    return `осенний пик активности, сезонный балл ${seasonScore}`;
  }
  if (month >= 7 && month <= 8) {
    return `летний режим, сезонный балл ${seasonScore}`;
  }
  if (month >= 3 && month <= 4) {
    return `весенний разгон активности, сезонный балл ${seasonScore}`;
  }
  return `сезонный балл ${seasonScore}`;
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
  const changes = raw.pressureDirectionChanges72h;
  if (typeof amplitude !== "number") return "нет данных за 48-72 ч";

  if (amplitude <= 2) return `стабильно, амплитуда ${amplitude} мм`;
  if (raw.pressureTrendKind === "strong_saw") return `сильная пила: ${amplitude} мм, смен направления ${changes}`;
  if (raw.pressureTrendKind === "saw") return `пила: ${amplitude} мм, смен направления ${changes}`;
  if (raw.pressureTrendKind === "unstable") return `легкая нестабильность: ${amplitude} мм, смен направления ${changes}`;
  return `направленное изменение: амплитуда ${amplitude} мм`;
}

function getPressureWeatherInterpretation(raw) {
  const delta = raw.pressureChange24hMmHg;
  const bright = (raw.cloudCoverPercent ?? 100) < 30;
  const cloudy = (raw.cloudCoverPercent ?? 0) >= 60;
  const clearWater = raw.waterClarity === "clear" || raw.waterClarity === "crystal_clear";

  if (raw.pressureTrendKind === "saw" || raw.pressureTrendKind === "strong_saw") {
    return `Барометрическая "пила" (${pressureTrendLabel(raw)}) означает нестабильный фон: форель хуже адаптируется к смене условий.`;
  }

  if (typeof delta === "number" && delta >= 7) {
    return `Давление резко растет (${formatDelta(delta, "мм")}): это похоже на переход к антициклону после фронта, часто один из худших сценариев для активности.`;
  }

  if (typeof delta === "number" && delta > 1) {
    return `Давление растет (${formatDelta(delta, "мм")}): вероятен переход к более антициклонической погоде; при ясном небе форель может стать осторожнее.`;
  }

  if (typeof delta === "number" && delta <= -7) {
    return `Давление резко падает (${formatDelta(delta, "мм")}): возможен короткий предфронтовый всплеск, но общий погодный режим становится рискованным.`;
  }

  if (typeof delta === "number" && delta < -1 && delta >= -4 && cloudy) {
    return `Давление плавно снижается (${formatDelta(delta, "мм")}): это похоже на предфронтовое окно с мягким светом, когда форель может активнее выходить из укрытий.`;
  }

  if ((raw.pressureAmplitude72hMmHg ?? 99) <= 2) {
    return `Давление стабильно за 48-72 часа: рыба успевает адаптироваться к фону, поэтому прогноз надежнее.`;
  }

  if ((raw.pressureMmHg ?? pressureToMmHg(raw.pressureHPa)) >= 766 && bright && clearWater) {
    return `Антициклональный сценарий: высокое давление, яркий свет и прозрачная вода повышают осторожность форели.`;
  }

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

  const info = {
    waterTemperature: `${raw.estimatedWaterTemperatureC ?? "-"} °C расчетной температуры воды, воздух ${raw.airTemperatureC ?? "-"} °C`,
    season: getSeasonText(day.date, score),
    weatherChange: `давление за 24 ч: ${pressureDeltaLabel(raw)}, ${pressureTrendLabel(raw)}, ветер: ${formatWindChange(raw)}, осадки за 72 ч: ${raw.precipitation72hMm ?? "-"} мм`,
    pressure: `${pressureToMmHg(raw.pressureHPa)} мм рт. ст. (${raw.pressureHPa ?? "-"} гПа)`,
    waterClarity: `${CLARITY_LABELS[raw.waterClarity] || "нет оценки"}, осадки за 24 ч: ${raw.precipitation24hMm ?? "-"} мм`,
    light: `облачность ${raw.cloudCoverPercent ?? "-"}%`,
    wind: `${windLabel(raw.windDirection)}, ${raw.windSpeedMs ?? "-"} м/с`,
    waterLevel: `${WATER_LEVEL_LABELS[raw.waterLevel] || "нет оценки"}`,
    moon: `${MOON_LABELS[raw.moonPhase] || "лунная фаза учтена как слабый фактор"}`
  };

  return info[factor.id] || "";
}

function getDetailedAnalytics(day) {
  const raw = day.raw || {};
  const parts = [];
  const factor = Object.fromEntries(day.factors.map((item) => [item.id, item.score]));

  if (factor.waterTemperature >= 85 && factor.season >= 85) {
    parts.push(`Температурный фон (${raw.estimatedWaterTemperatureC} °C) хорошо совпадает с сильной сезонной фазой.`);
  } else if (factor.waterTemperature < 70) {
    parts.push(`Температура воды (${raw.estimatedWaterTemperatureC} °C) ограничивает активность, даже если часть остальных факторов выглядит неплохо.`);
  }

  if (factor.pressure >= 75 && factor.weatherChange >= 75) {
    parts.push(`Давление ${pressureToMmHg(raw.pressureHPa)} мм рт. ст. и спокойная динамика дают устойчивый погодный фон.`);
  } else if (factor.pressure < 60 || factor.weatherChange < 60) {
    parts.push(`Погодный блок слабый: давление ${pressureToMmHg(raw.pressureHPa)} мм рт. ст., изменение за сутки ${pressureDeltaLabel(raw)}.`);
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
    parts.push(`Ветер благоприятный: ${windLabel(raw.windDirection)}, ${raw.windSpeedMs} м/с.`);
  } else if (factor.wind < 60) {
    parts.push(`Ветер работает против прогноза: ${windLabel(raw.windDirection)}, ${raw.windSpeedMs} м/с.`);
  }

  if (day.appliedCaps?.length) {
    parts.push(`Индекс скорректирован правилом модели: ${day.appliedCaps.map((cap) => cap.reason).join("; ")}.`);
  }

  return parts.slice(0, 4);
}

function getCurrentDay() {
  return appData.regions[selectedRegionId].forecast[selectedDayIndex];
}

function getDataForMode(mode) {
  if (onlineData) {
    return onlineData;
  }

  if (window.LIVE_RESULTS) {
    return window.LIVE_RESULTS;
  }

  return null;
}

async function loadDataForMode(mode) {
  if (onlineData) return onlineData;
  if (!window.fetchOnlineResults) return window.LIVE_RESULTS;

  onlineStatus = "loading";
  renderModeSwitch();

  try {
    onlineData = await window.fetchOnlineResults();
    onlineStatus = "online";
    return onlineData;
  } catch (error) {
    console.warn("Online weather failed, using saved live data", error);
    onlineStatus = "fallback";
    return window.LIVE_RESULTS;
  }
}

function renderModeSwitch() {
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === dataMode);
  });

  let label = "реальная погода";
  if (onlineStatus === "loading") label = "загружаю погоду...";
  else if (onlineStatus === "online") label = "онлайн Open-Meteo";
  else if (onlineStatus === "fallback") label = "сохраненная реальная погода";
  elements.dataStatusText.textContent = `Данные: ${label}`;
}

function setupModeSwitch() {
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const nextMode = button.dataset.mode;
      if (nextMode === dataMode) return;

      dataMode = nextMode;
      selectedDayIndex = 0;
      appData = await loadDataForMode(dataMode);
      render();
    });
  });
}

function renderRegionTabs() {
  elements.regionTabs.innerHTML = Object.keys(appData.regions)
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

  elements.indexPanel.style.setProperty("--score", day.index);
  elements.indexPanel.style.setProperty("--score-color", color);
  elements.indexPanel.innerHTML = `
    <div class="score-ring" aria-label="Индекс ${day.index} из 100">
      <div class="score-value">
        <strong>${day.index}</strong>
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
          <span class="meta-label">Вода</span>
          <span class="meta-value">${raw.estimatedWaterTemperatureC ?? "-"} °C</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Давление</span>
          <span class="meta-value">${pressureToMmHg(raw.pressureHPa)} мм</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Ветер</span>
          <span class="meta-value">${windLabel(raw.windDirection)} · ${raw.windSpeedMs ?? "-"} м/с</span>
        </div>
      </div>
      <div class="analytics-block">
        <h3>Почему такая оценка</h3>
        <ul>
          ${getDetailedAnalytics(day).map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
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
  const region = appData.regions[selectedRegionId];
  selectedDayIndex = Math.min(selectedDayIndex, region.forecast.length - 1);

  elements.forecastStrip.innerHTML = region.forecast
    .map((day, index) => {
      const active = index === selectedDayIndex ? " active" : "";
      return `
        <button class="forecast-card${active}" type="button" data-day="${index}">
          <div class="forecast-date">${formatDate(day.date)}</div>
          <div class="forecast-score">
            <strong style="color:${scoreColor(day.index)}">${day.index}</strong>
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
            <span>Вес ${factor.weightPercent}% · вклад ${factor.contribution}</span>
            <em>${getFactorPrimaryInfo(factor, day)}</em>
          </div>
          <div class="factor-score" style="color:${color}">${factor.score}</div>
          <div>
            <div class="bar-track">
              <div class="bar-fill" style="--width:${factor.score}%; --bar-color:${color}"></div>
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
  const day = getCurrentDay();
  renderModeSwitch();
  renderRegionTabs();
  renderIndexPanel(day);
  renderDrivers(elements.positiveDrivers, day.positiveDrivers, "Выраженных плюсов нет.");
  renderDrivers(elements.negativeDrivers, day.negativeDrivers, "Выраженных рисков нет.");
  renderForecast();
  renderFactors(day);
  renderRecommendations(day);
}

async function init() {
  try {
    setupModeSwitch();

    appData = await loadDataForMode(dataMode);
    render();
  } catch (error) {
    document.body.innerHTML = `
      <main class="app-shell">
        <section class="panel">
          <h1>Не удалось загрузить данные</h1>
          <p class="summary">Запусти локальный сервер из папки trout-dashboard и открой /app/.</p>
        </section>
      </main>
    `;
    console.error(error);
  }
}

init();
