const FACTOR_WEIGHTS = {
  waterTemperature: 0.22,
  season: 0.21,
  weatherChange: 0.22,
  pressure: 0.07,
  waterClarity: 0.10,
  light: 0.08,
  wind: 0.05,
  waterLevel: 0.03,
  moon: 0.02
};

const FACTOR_LABELS = {
  waterTemperature: "Температура воды",
  season: "Сезонная фаза",
  weatherChange: "Изменение погоды",
  pressure: "Атмосферное давление",
  waterClarity: "Прозрачность воды",
  light: "Освещенность",
  wind: "Ветер",
  waterLevel: "Уровень воды",
  moon: "Луна"
};

const FACTOR_HINTS = {
  waterTemperature: {
    positive: "температурный фон воды близок к рабочей зоне форели",
    negative: "температура воды снижает активность форели"
  },
  season: {
    positive: "сезонная фаза поддерживает кормовую активность",
    negative: "сезонная фаза ограничивает активность рыбы"
  },
  weatherChange: {
    positive: "динамика погоды поддерживает прогноз",
    negative: "нестабильная динамика погоды ухудшает прогноз"
  },
  pressure: {
    positive: "давление находится в хорошем диапазоне",
    negative: "давление неблагоприятно для клева"
  },
  waterClarity: {
    positive: "прозрачность воды помогает рыбе видеть приманку",
    negative: "мутность или чрезмерная прозрачность ухудшают условия"
  },
  light: {
    positive: "освещенность мягкая и не делает рыбу излишне осторожной",
    negative: "освещенность делает рыбу осторожнее"
  },
  wind: {
    positive: "ветер по направлению и силе благоприятен",
    negative: "ветер ухудшает условия или связан с неблагоприятным режимом"
  },
  waterLevel: {
    positive: "уровень воды без крайних отклонений",
    negative: "уровень или сила потока близки к крайним значениям"
  },
  moon: {
    positive: "лунный фактор слегка поддерживает прогноз",
    negative: "лунный фактор не поддерживает прогноз"
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, digits = 1) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function getRating(index) {
  if (index <= 25) return "плохо";
  if (index <= 50) return "слабо";
  if (index <= 70) return "перспективно";
  if (index <= 85) return "хорошо";
  return "отлично";
}

function getFactorStatus(score) {
  if (score >= 75) return "помогает";
  if (score >= 50) return "нейтрально";
  return "мешает";
}

function calculateFactorContributions(factorScores) {
  return Object.entries(FACTOR_WEIGHTS).map(([id, weight]) => {
    const score = clamp(Number(factorScores[id] ?? 0), 0, 100);
    const contribution = score * weight;

    return {
      id,
      label: FACTOR_LABELS[id],
      weight,
      weightPercent: round(weight * 100, 0),
      score,
      contribution: round(contribution, 2),
      status: getFactorStatus(score),
      explanation: getFactorExplanation(id, score)
    };
  });
}

function getFactorExplanation(id, score) {
  if (id === "weatherChange") {
    if (score >= 80) return "давление и погода меняются в благоприятном или стабильном режиме";
    if (score >= 60) return "есть заметные изменения погоды, прогноз требует осторожности";
    return "динамика давления, ветра или фронта ухудшает прогноз";
  }

  if (id === "pressure") {
    if (score >= 75) return "текущий барометрический фон комфортный";
    if (score >= 50) return "текущий уровень давления нейтральный или контекстно зависимый";
    return "текущий уровень давления неблагоприятен, особенно в сочетании с резкой сменой погоды";
  }

  if (score >= 75) return FACTOR_HINTS[id].positive;
  if (score < 60) return FACTOR_HINTS[id].negative;

  const neutral = {
    waterTemperature: "температура воды рабочая, но не идеальная",
    season: "сезонная фаза еще не дает максимальной активности",
    waterClarity: "прозрачность воды неоднозначна и требует подбора приманки",
    light: "освещенность нейтральная, без сильного плюса",
    wind: "ветер нейтральный или умеренно спорный",
    waterLevel: "уровень воды без явного плюса",
    moon: "лунный фактор нейтральный"
  };

  return neutral[id] || FACTOR_HINTS[id].negative;
}

function applyCaps(indexRaw, conditions) {
  const caps = [];
  const penalties = [];
  const raw = conditions.raw || {};
  const explicitCaps = conditions.caps || [];
  let index = indexRaw;

  if (raw.estimatedWaterTemperatureC >= 20) {
    caps.push({
      id: "warm_water_cap_45",
      limit: 45,
      reason: "расчетная температура воды выше 20 °C"
    });
  }

  if (raw.estimatedWaterTemperatureC >= 20 && raw.waterLevel === "critically_low") {
    caps.push({
      id: "warm_low_water_cap_30",
      limit: 30,
      reason: "жара сочетается с критически низким уровнем воды"
    });
  }

  if (raw.waterLevel === "flood_risk" || explicitCaps.includes("flood_cap_35")) {
    penalties.push({
      id: "flood_risk_penalty_12",
      value: 12,
      reason: "есть признаки паводкового уровня, поэтому индекс снижен мягким штрафом"
    });
  }

  for (const cap of caps) {
    index = Math.min(index, cap.limit);
  }

  for (const penalty of penalties) {
    index -= penalty.value;
  }

  index = clamp(index, 0, 100);

  return {
    index,
    appliedCaps: [
      ...caps.filter((cap) => cap.limit < indexRaw),
      ...penalties.filter((penalty) => penalty.value > 0)
    ]
  };
}

function getDrivers(factors) {
  const positiveDrivers = [...factors]
    .filter((factor) => factor.id !== "moon" && factor.score >= 80)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map((factor) => ({
      factor: factor.label,
      score: factor.score,
      reason: factor.explanation
    }));

  const negativeDrivers = [...factors]
    .filter((factor) => factor.id !== "moon" && factor.score < 60)
    .sort((a, b) => a.score - b.score || b.weight - a.weight)
    .slice(0, 3)
    .map((factor) => ({
      factor: factor.label,
      score: factor.score,
      reason: factor.explanation
    }));

  return { positiveDrivers, negativeDrivers };
}

function hasFlag(conditions, flag) {
  return (conditions.flags || []).includes(flag);
}

function getRecommendations(conditions) {
  const raw = conditions.raw || {};
  const recommendations = [];

  const clarity = raw.waterClarity;
  const bright = hasFlag(conditions, "bright_sun") || (raw.cloudCoverPercent ?? 100) < 30;
  const muddy = clarity === "moderately_muddy" || clarity === "strongly_muddy";
  const stable = (conditions.factorScores?.weatherChange ?? 0) >= 75;
  const activeTemperature = (conditions.factorScores?.waterTemperature ?? 0) >= 85;
  const lowWater = raw.waterLevel === "slightly_low" || raw.waterLevel === "low" || hasFlag(conditions, "clear_low_water");
  const strongWind = raw.windSpeedMs >= 7;
  const coldWater = raw.estimatedWaterTemperatureC <= 9;
  const warmWater = raw.estimatedWaterTemperatureC >= 18;
  const veryClear = clarity === "crystal_clear" || clarity === "clear";

  recommendations.push(getTimingRecommendation(conditions));
  recommendations.push(getCastingDistanceRecommendation(conditions));

  if (activeTemperature && stable && !muddy && !bright) {
    recommendations.push("Модель ловли: рыба должна быть достаточно активной. Начни с маленького воблера-минноу или вращающейся блесны, облавливай перекаты, кромки струи и входы в ямы.");
  } else if (muddy) {
    recommendations.push("Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.");
  } else if (bright || lowWater || veryClear) {
    recommendations.push("Модель ловли: форель будет осторожнее обычного. Подходи ниже по течению, держи дистанцию, делай первые забросы издалека и начинай с натуральных воблеров, микроколебалок или мягкой резины без лишнего блеска.");
  } else if (coldWater) {
    recommendations.push("Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.");
  }

  if (hasFlag(conditions, "bright_sun") || (raw.cloudCoverPercent ?? 100) < 30) {
    recommendations.push("При ярком солнце держи дистанцию, облавливай тень и используй более естественные цвета.");
  }

  if (raw.waterClarity === "crystal_clear") {
    recommendations.push("Приманки: кристально прозрачная вода просит натуральные цвета, маленькие воблеры 30-50 мм, микроколебалки 1.5-3 г и некрупный силикон. Проводка спокойная, без лишней агрессии.");
  }

  if (raw.waterClarity === "slightly_tea_clear") {
    recommendations.push("Приманки: слегка чайная прозрачная вода хороша для меди, золота, темных силуэтов, маленьких колебалок и минноу с умеренным контрастом.");
  }

  if (raw.waterClarity === "moderately_muddy") {
    recommendations.push("Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.");
  }

  if (raw.waterClarity === "strongly_muddy") {
    recommendations.push("Приманки: при сильной мутности используй крупнее силуэт, яркий контраст и вибрацию; при этом общий потенциал ловли низкий.");
  }

  if (raw.windSpeedMs >= 7) {
    recommendations.push("Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.");
  }

  if (["N", "NE", "E"].includes(raw.windDirection)) {
    recommendations.push("При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.");
  }

  if (hasFlag(conditions, "clear_low_water") || raw.waterLevel === "slightly_low") {
    recommendations.push("На низкой воде ищи ямки, тень, укрытия и локальные стоянки, не заходи в воду без необходимости.");
  }

  if (raw.estimatedWaterTemperatureC <= 9) {
    recommendations.push("Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.");
  }

  if (raw.estimatedWaterTemperatureC >= 18) {
    recommendations.push("Проводка: при теплой воде выбирай раннее утро, тень, родниковые участки и быстрые перекаты; не затягивай вываживание и бережно отпускай рыбу.");
  }

  if (!coldWater && !strongWind && !bright && !muddy && raw.windSpeedMs >= 1 && raw.windSpeedMs <= 4) {
    recommendations.push("Подача: легкая рябь и мягкий свет позволяют ловить активнее: равномерная проводка вращалки или воблера поперек/на снос будет хорошей стартовой схемой.");
  }

  if (hasFlag(conditions, "prefrontal_window")) {
    recommendations.push("Поведение рыбы: плавное снижение давления похоже на предфронтовое окно. При облачности и влажности форель может смелее выходить из укрытий, но следи за мутностью воды.");
  }

  if (hasFlag(conditions, "anticyclone_clear")) {
    recommendations.push("Поведение рыбы: антициклональный сценарий с высоким давлением и ярким светом повышает осторожность. Делай дальние первые забросы, выбирай тень и натуральные цвета.");
  }

  if (stable && (raw.pressureAmplitude72hMmHg ?? 99) <= 2) {
    recommendations.push("Поведение рыбы: давление стабильно, рыба успевает адаптироваться к фону, поэтому прогноз надежнее, чем при резких скачках.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Условия ровные: начни с классической подачи, затем подстраивай размер и цвет под прозрачность воды.");
  }

  return recommendations;
}

function getTimingRecommendation(conditions) {
  const raw = conditions.raw || {};
  const month = new Date(`${conditions.date}T12:00:00`).getMonth() + 1;
  const coldWater = raw.estimatedWaterTemperatureC <= 9;
  const warmWater = raw.estimatedWaterTemperatureC >= 18;
  const bright = hasFlag(conditions, "bright_sun") || (raw.cloudCoverPercent ?? 100) < 30;
  const stable = (conditions.factorScores?.weatherChange ?? 0) >= 75;
  const softLight = (raw.cloudCoverPercent ?? 0) >= 55;

  if (coldWater || month <= 4) {
    return "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.";
  }

  if (warmWater || month === 7 || month === 8) {
    return "Когда ловить: лучший выбор - утро; вечером можно пробовать тень и быстрые участки, а середину жаркого дня лучше оценивать осторожно.";
  }

  if (month >= 9 && month <= 10) {
    return "Когда ловить: осенью можно ловить утром, днем и вечером; важнее стабильное давление, прозрачность воды и отсутствие резкой смены погоды.";
  }

  if (bright && !softLight) {
    return "Когда ловить: при ярком солнце лучше утро или вечер; днем выбирай тень, нависающие берега и закрытые лесом участки.";
  }

  if (stable && softLight) {
    return "Когда ловить: утро, день и вечер рабочие; мягкая облачность и стабильная погода позволяют не привязываться жестко ко времени.";
  }

  return "Когда ловить: начни с утра или вечера, а днем смещайся к тени, глубине и участкам с более спокойной подачей.";
}

function getCastingDistanceRecommendation(conditions) {
  const raw = conditions.raw || {};
  const clarity = raw.waterClarity;
  const bright = hasFlag(conditions, "bright_sun") || (raw.cloudCoverPercent ?? 100) < 30;
  const lowWater = raw.waterLevel === "slightly_low" || raw.waterLevel === "low" || hasFlag(conditions, "clear_low_water");
  const clearWater = clarity === "crystal_clear" || clarity === "clear";
  const teaWater = clarity === "slightly_tea_clear" || clarity === "slightly_colored_clear";
  const muddy = clarity === "moderately_muddy" || clarity === "strongly_muddy";
  const windRipple = raw.windSpeedMs >= 1 && raw.windSpeedMs <= 4;

  if ((bright && clearWater) || (clearWater && lowWater)) {
    return "Дальность и скрытность: форель, скорее всего, видит рыболова далеко. Первые забросы делай с дальней дистанции, заходи низко и тихо, не выходи на открытый берег до проверки ближних точек.";
  }

  if (bright || lowWater) {
    return "Дальность и скрытность: осторожность повышена. Начинай издалека, двигайся медленно, используй береговые укрытия и не становись силуэтом на фоне неба.";
  }

  if (muddy) {
    return "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.";
  }

  if (teaWater || windRipple) {
    return "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.";
  }

  return "Дальность и скрытность: держи среднюю дистанцию, сначала облавливай ближние перспективные точки, затем переходи к дальним забросам вверх или поперек течения.";
}

function getWarnings(conditions, appliedCaps) {
  const raw = conditions.raw || {};
  const warnings = [];

  for (const cap of appliedCaps) {
    warnings.push(cap.reason);
  }

  const pressureMmHg =
    typeof raw.pressureMmHg === "number"
      ? raw.pressureMmHg
      : typeof raw.pressureHPa === "number"
        ? Math.round(raw.pressureHPa * 0.750062)
        : null;

  if (pressureMmHg != null && pressureMmHg < 730) {
    warnings.push("очень низкое атмосферное давление может указывать на сильный циклональный режим");
  }

  if ((raw.pressureChange24hMmHg ?? raw.pressureChange24hHPa * 0.750062) <= -7) {
    warnings.push("давление резко падает, это может дать короткое окно активности и последующий провал");
  }

  if ((raw.pressureChange24hMmHg ?? raw.pressureChange24hHPa * 0.750062) >= 7) {
    warnings.push("давление резко растет после смены погоды, это неблагоприятный сигнал");
  }

  if (raw.pressureTrendKind === "saw" || raw.pressureTrendKind === "strong_saw") {
    warnings.push(`давление идет пилой: амплитуда ${raw.pressureAmplitude72hMmHg ?? "?"} мм за 48-72 ч и ${raw.pressureDirectionChanges72h ?? "?"} смены направления`);
  }

  if ((raw.windDirectionChangeDegrees ?? 0) >= 90 || Math.abs(raw.windSpeedChange24hMs ?? 0) >= 4) {
    warnings.push("ветер заметно меняется по направлению или силе, погодный режим нестабилен");
  }

  if (raw.waterClarity === "strongly_muddy") {
    warnings.push("вода может быть слишком мутной для эффективной визуальной атаки");
  }

  if (raw.windSpeedMs >= 8) {
    warnings.push("сильный ветер может мешать забросу и проводке");
  }

  if (raw.estimatedWaterTemperatureC >= 20) {
    warnings.push("температура воды может быть стрессовой для форели");
  }

  return [...new Set(warnings)];
}

function getSummary(index, rating, drivers) {
  const best = drivers.positiveDrivers[0]?.factor;
  const worst = drivers.negativeDrivers[0]?.factor;

  if (rating === "отлично") {
    return `Очень сильное сочетание условий. Главный плюс: ${best || "несколько ключевых факторов работают в плюс"}.`;
  }

  if (rating === "хорошо") {
    return `Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: ${best || "стабильный общий фон"}.`;
  }

  if (rating === "перспективно") {
    return `Есть рабочие условия, но прогноз не без слабых мест. Главный риск: ${worst || "локальные различия воды"}.`;
  }

  if (rating === "слабо") {
    return `Условия слабые, поездка требует точного выбора места и тактики. Главный минус: ${worst || "несколько факторов против клева"}.`;
  }

  return `Условия неблагоприятные. Главный минус: ${worst || "сильное сочетание негативных факторов"}.`;
}

function calculateIndex(conditions) {
  const factors = calculateFactorContributions(conditions.factorScores || {});
  const indexRaw = factors.reduce((sum, factor) => sum + factor.contribution, 0);
  const { index, appliedCaps } = applyCaps(indexRaw, conditions);
  const roundedIndex = Math.round(index);
  const rating = getRating(roundedIndex);
  const drivers = getDrivers(factors);

  return {
    date: conditions.date,
    index: roundedIndex,
    indexRaw: round(indexRaw, 2),
    rating,
    confidence: conditions.confidence || "medium",
    summary: getSummary(roundedIndex, rating, drivers),
    factors,
    positiveDrivers: drivers.positiveDrivers,
    negativeDrivers: drivers.negativeDrivers,
    recommendations: getRecommendations(conditions),
    warnings: getWarnings(conditions, appliedCaps),
    appliedCaps,
    flags: conditions.flags || []
  };
}

module.exports = {
  FACTOR_WEIGHTS,
  FACTOR_LABELS,
  calculateIndex,
  calculateFactorContributions,
  getRating
};
