window.LIVE_RESULTS = {
  "metadata": {
    "version": "0.1",
    "dataType": "live-results-sample",
    "modelVersion": "0.4",
    "generatedAt": "2026-04-25T14:11:27.861Z",
    "source": "data/live-conditions-sample.json"
  },
  "regions": {
    "south_west": {
      "summary": "Юго-запад Ленинградской области: Систо-Палкино. Реальные погодные данные, гидрология рассчитана косвенно.",
      "forecast": [
        {
          "date": "2026-04-25",
          "index": 68,
          "indexRaw": 68.21,
          "rating": "перспективно",
          "confidence": "medium",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 68,
              "contribution": 10.88,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 91,
              "contribution": 11.83,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 93,
              "contribution": 4.65,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 91,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Ветер",
              "score": 93,
              "reason": "ветер по направлению и силе благоприятен"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "cloudy",
            "favorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.8,
            "airTemperatureC": 2.7,
            "pressureHPa": 995.3,
            "pressureMmHg": 747,
            "pressureChange24hHPa": -8.7,
            "pressureChange24hMmHg": -6.5,
            "temperatureChange24hC": -1.4,
            "precipitation24hMm": 13,
            "precipitation72hMm": 13.6,
            "cloudCoverPercent": 91,
            "windDirection": "S",
            "windDirectionDegrees": 198,
            "windSpeedMs": 3,
            "windGustsMs": 12.7,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "W",
            "windDirectionChangeDegrees": 90,
            "windSpeedChange24hMs": 0.3,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-26",
          "index": 60,
          "indexRaw": 60.44,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 40,
              "contribution": 6.4,
              "status": "мешает",
              "explanation": "резкие изменения погоды ухудшают прогноз"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 90,
              "contribution": 11.7,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 59,
              "contribution": 2.95,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 48,
              "contribution": 1.44,
              "status": "мешает",
              "explanation": "уровень или сила потока близки к крайним значениям"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 90,
              "reason": "давление находится в хорошем для ручья диапазоне"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 40,
              "reason": "резкие изменения погоды ухудшают прогноз"
            },
            {
              "factor": "Уровень воды",
              "score": 48,
              "reason": "уровень или сила потока близки к крайним значениям"
            },
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "wind_speed_shift",
            "low_pressure",
            "cloudy",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.5,
            "airTemperatureC": 2,
            "pressureHPa": 993.6,
            "pressureMmHg": 745,
            "pressureChange24hHPa": -1.7,
            "pressureChange24hMmHg": -1.3,
            "temperatureChange24hC": -0.7,
            "precipitation24hMm": 16.8,
            "precipitation72hMm": 29.8,
            "cloudCoverPercent": 100,
            "windDirection": "NW",
            "windDirectionDegrees": 320,
            "windSpeedMs": 7.3,
            "windGustsMs": 18.8,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "high",
            "windDirectionPrevious": "S",
            "windDirectionChangeDegrees": 135,
            "windSpeedChange24hMs": 4.3,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-27",
          "index": 67,
          "indexRaw": 66.94,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 58,
              "contribution": 9.28,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 98,
              "contribution": 12.74,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 59,
              "contribution": 2.95,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 98,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "factor": "Резкие изменения погоды",
              "score": 58,
              "reason": "есть заметные изменения погоды, прогноз требует осторожности"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.8,
            "airTemperatureC": 4.5,
            "pressureHPa": 1006.3,
            "pressureMmHg": 755,
            "pressureChange24hHPa": 12.7,
            "pressureChange24hMmHg": 9.5,
            "temperatureChange24hC": 2.5,
            "precipitation24hMm": 0,
            "precipitation72hMm": 29.8,
            "cloudCoverPercent": 51,
            "windDirection": "NW",
            "windDirectionDegrees": 331,
            "windSpeedMs": 7.5,
            "windGustsMs": 17.8,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "NW",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": 0.2,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-28",
          "index": 71,
          "indexRaw": 70.81,
          "rating": "хорошо",
          "confidence": "low",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 84,
              "contribution": 13.44,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 100,
              "contribution": 13,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 48,
              "contribution": 2.4,
              "status": "мешает",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 84,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 100,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Ветер",
              "score": 48,
              "reason": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.",
            "Поведение рыбы: стабильная погода и хорошее давление снижают риск внезапного провала клева, поэтому можно больше перемещаться и проверять активные точки."
          ],
          "warnings": [
            "сильный ветер может мешать забросу и проводке"
          ],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.8,
            "airTemperatureC": 3.7,
            "pressureHPa": 1010.1,
            "pressureMmHg": 758,
            "pressureChange24hHPa": 3.8,
            "pressureChange24hMmHg": 2.9,
            "temperatureChange24hC": -0.8,
            "precipitation24hMm": 0.1,
            "precipitation72hMm": 29.9,
            "cloudCoverPercent": 88,
            "windDirection": "N",
            "windDirectionDegrees": 340,
            "windSpeedMs": 8,
            "windGustsMs": 21.4,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "NW",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": 0.5,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-29",
          "index": 68,
          "indexRaw": 68.2,
          "rating": "перспективно",
          "confidence": "medium",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Сезонная фаза.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 64,
              "contribution": 10.24,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 79,
              "contribution": 10.27,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 68,
              "contribution": 3.4,
              "status": "нейтрально",
              "explanation": "ветер нейтральный или умеренно спорный"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 90,
              "contribution": 2.7,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Уровень воды",
              "score": 90,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "cloudy"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.8,
            "airTemperatureC": 3.5,
            "pressureHPa": 1019.3,
            "pressureMmHg": 765,
            "pressureChange24hHPa": 9.2,
            "pressureChange24hMmHg": 6.9,
            "temperatureChange24hC": -0.2,
            "precipitation24hMm": 0.9,
            "precipitation72hMm": 17.8,
            "cloudCoverPercent": 97,
            "windDirection": "NW",
            "windDirectionDegrees": 331,
            "windSpeedMs": 4.4,
            "windGustsMs": 11.7,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "normal",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": -3.6,
            "moonPhase": "unknown"
          }
        }
      ]
    },
    "south": {
      "summary": "Юг Ленинградской области: Сиверский. Реальные погодные данные, гидрология рассчитана косвенно.",
      "forecast": [
        {
          "date": "2026-04-25",
          "index": 76,
          "indexRaw": 75.51,
          "rating": "хорошо",
          "confidence": "medium",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 66,
              "contribution": 14.52,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 82,
              "contribution": 13.12,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 92,
              "contribution": 11.96,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 96,
              "contribution": 4.8,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 90,
              "contribution": 2.7,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 82,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 92,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "favorable_wind"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.9,
            "airTemperatureC": 3,
            "pressureHPa": 996.5,
            "pressureMmHg": 747,
            "pressureChange24hHPa": -7.2,
            "pressureChange24hMmHg": -5.4,
            "temperatureChange24hC": -0.5,
            "precipitation24hMm": 5.1,
            "precipitation72hMm": 6,
            "cloudCoverPercent": 80,
            "windDirection": "SW",
            "windDirectionDegrees": 203,
            "windSpeedMs": 3.5,
            "windGustsMs": 10.5,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "normal",
            "windDirectionPrevious": "W",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": 0.7,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-26",
          "index": 71,
          "indexRaw": 71.08,
          "rating": "хорошо",
          "confidence": "medium",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 92,
              "contribution": 14.72,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 90,
              "contribution": 11.7,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 85,
              "contribution": 4.25,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 92,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 90,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Ветер",
              "score": 85,
              "reason": "ветер по направлению и силе благоприятен"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "low_pressure",
            "cloudy",
            "favorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.5,
            "airTemperatureC": 1.4,
            "pressureHPa": 992.1,
            "pressureMmHg": 744,
            "pressureChange24hHPa": -4.4,
            "pressureChange24hMmHg": -3.3,
            "temperatureChange24hC": -1.6,
            "precipitation24hMm": 9,
            "precipitation72hMm": 14.5,
            "cloudCoverPercent": 100,
            "windDirection": "W",
            "windDirectionDegrees": 291,
            "windSpeedMs": 5.9,
            "windGustsMs": 14.1,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "SW",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": 2.4,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-27",
          "index": 71,
          "indexRaw": 70.57,
          "rating": "хорошо",
          "confidence": "medium",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Атмосферное давление.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 58,
              "contribution": 9.28,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 96,
              "contribution": 12.48,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 68,
              "contribution": 3.4,
              "status": "нейтрально",
              "explanation": "ветер нейтральный или умеренно спорный"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 90,
              "contribution": 2.7,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 96,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "factor": "Резкие изменения погоды",
              "score": 58,
              "reason": "есть заметные изменения погоды, прогноз требует осторожности"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "cloudy",
            "strong_gusts"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 3.4,
            "pressureHPa": 1004,
            "pressureMmHg": 753,
            "pressureChange24hHPa": 11.9,
            "pressureChange24hMmHg": 8.9,
            "temperatureChange24hC": 2,
            "precipitation24hMm": 0.7,
            "precipitation72hMm": 15,
            "cloudCoverPercent": 70,
            "windDirection": "NW",
            "windDirectionDegrees": 335,
            "windSpeedMs": 6.9,
            "windGustsMs": 16.2,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "normal",
            "windDirectionPrevious": "W",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": 1,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-28",
          "index": 73,
          "indexRaw": 73.2,
          "rating": "хорошо",
          "confidence": "medium",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 64,
              "contribution": 14.08,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 84,
              "contribution": 13.44,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 98,
              "contribution": 12.74,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 59,
              "contribution": 2.95,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 90,
              "contribution": 2.7,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 84,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 98,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "factor": "Ветер",
              "score": 59,
              "reason": "ветер ухудшает условия или связан с неблагоприятным режимом"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.",
            "Поведение рыбы: стабильная погода и хорошее давление снижают риск внезапного провала клева, поэтому можно больше перемещаться и проверять активные точки."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "strong_gusts"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.6,
            "airTemperatureC": 2.4,
            "pressureHPa": 1007.8,
            "pressureMmHg": 756,
            "pressureChange24hHPa": 3.8,
            "pressureChange24hMmHg": 2.9,
            "temperatureChange24hC": -1,
            "precipitation24hMm": 0.1,
            "precipitation72hMm": 14.9,
            "cloudCoverPercent": 99,
            "windDirection": "NW",
            "windDirectionDegrees": 334,
            "windSpeedMs": 7.1,
            "windGustsMs": 19.3,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "normal",
            "windDirectionPrevious": "NW",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": 0.2,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-29",
          "index": 68,
          "indexRaw": 67.89,
          "rating": "перспективно",
          "confidence": "medium",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Сезонная фаза.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 64,
              "contribution": 10.24,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 80,
              "contribution": 10.4,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 68,
              "contribution": 3.4,
              "status": "нейтрально",
              "explanation": "ветер нейтральный или умеренно спорный"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 90,
              "contribution": 2.7,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 80,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Уровень воды",
              "score": 90,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "cloudy"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.5,
            "airTemperatureC": 2.6,
            "pressureHPa": 1018.1,
            "pressureMmHg": 764,
            "pressureChange24hHPa": 10.3,
            "pressureChange24hMmHg": 7.7,
            "temperatureChange24hC": 0.2,
            "precipitation24hMm": 0.3,
            "precipitation72hMm": 10.1,
            "cloudCoverPercent": 100,
            "windDirection": "NW",
            "windDirectionDegrees": 334,
            "windSpeedMs": 4.2,
            "windGustsMs": 11.8,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "normal",
            "windDirectionPrevious": "NW",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": -2.9,
            "moonPhase": "unknown"
          }
        }
      ]
    },
    "north_east": {
      "summary": "Северо-восток Ленинградской области: Сосново, Приозерский район. Реальные погодные данные, гидрология рассчитана косвенно.",
      "forecast": [
        {
          "date": "2026-04-25",
          "index": 71,
          "indexRaw": 71.41,
          "rating": "хорошо",
          "confidence": "medium",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Атмосферное давление.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 68,
              "contribution": 10.88,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 91,
              "contribution": 11.83,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 93,
              "contribution": 4.65,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 91,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Ветер",
              "score": 93,
              "reason": "ветер по направлению и силе благоприятен"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "low_pressure",
            "cloudy",
            "favorable_wind"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 2.2,
            "pressureHPa": 994.9,
            "pressureMmHg": 746,
            "pressureChange24hHPa": -7.9,
            "pressureChange24hMmHg": -5.9,
            "temperatureChange24hC": -1.8,
            "precipitation24hMm": 8.5,
            "precipitation72hMm": 11.6,
            "cloudCoverPercent": 96,
            "windDirection": "S",
            "windDirectionDegrees": 202,
            "windSpeedMs": 2.6,
            "windGustsMs": 10.6,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "W",
            "windDirectionChangeDegrees": 90,
            "windSpeedChange24hMs": 0.1,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-26",
          "index": 60,
          "indexRaw": 59.82,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 56,
              "contribution": 8.96,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 89,
              "contribution": 11.57,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 22,
              "contribution": 2.2,
              "status": "мешает",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 58,
              "contribution": 2.9,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 48,
              "contribution": 1.44,
              "status": "мешает",
              "explanation": "уровень или сила потока близки к крайним значениям"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 89,
              "reason": "давление находится в хорошем для ручья диапазоне"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 22,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Уровень воды",
              "score": 48,
              "reason": "уровень или сила потока близки к крайним значениям"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при сильной мутности используй крупнее силуэт, яркий контраст и вибрацию; при этом общий потенциал ловли низкий.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен",
            "вода может быть слишком мутной для эффективной визуальной атаки"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "low_pressure",
            "cloudy",
            "unfavorable_wind",
            "strong_gusts",
            "strong_muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.4,
            "airTemperatureC": 1,
            "pressureHPa": 991.7,
            "pressureMmHg": 744,
            "pressureChange24hHPa": -3.2,
            "pressureChange24hMmHg": -2.4,
            "temperatureChange24hC": -1.2,
            "precipitation24hMm": 24.8,
            "precipitation72hMm": 33.7,
            "cloudCoverPercent": 100,
            "windDirection": "N",
            "windDirectionDegrees": 347,
            "windSpeedMs": 4.6,
            "windGustsMs": 15.2,
            "waterClarity": "strongly_muddy",
            "waterClarityLabel": "сильно мутная",
            "waterLevel": "high",
            "windDirectionPrevious": "S",
            "windDirectionChangeDegrees": 180,
            "windSpeedChange24hMs": 2,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-27",
          "index": 67,
          "indexRaw": 66.63,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 58,
              "contribution": 9.28,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 96,
              "contribution": 12.48,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 58,
              "contribution": 2.9,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 96,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "factor": "Резкие изменения погоды",
              "score": 58,
              "reason": "есть заметные изменения погоды, прогноз требует осторожности"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 3.8,
            "pressureHPa": 1004.3,
            "pressureMmHg": 753,
            "pressureChange24hHPa": 12.6,
            "pressureChange24hMmHg": 9.5,
            "temperatureChange24hC": 2.8,
            "precipitation24hMm": 0.1,
            "precipitation72hMm": 33.8,
            "cloudCoverPercent": 65,
            "windDirection": "N",
            "windDirectionDegrees": 344,
            "windSpeedMs": 6.1,
            "windGustsMs": 15.8,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": 1.5,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-28",
          "index": 70,
          "indexRaw": 69.99,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 84,
              "contribution": 13.44,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 98,
              "contribution": 12.74,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 68,
              "contribution": 3.4,
              "status": "нейтрально",
              "explanation": "ветер нейтральный или умеренно спорный"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 84,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 98,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.",
            "Поведение рыбы: стабильная погода и хорошее давление снижают риск внезапного провала клева, поэтому можно больше перемещаться и проверять активные точки."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.4,
            "airTemperatureC": 1.7,
            "pressureHPa": 1007.9,
            "pressureMmHg": 756,
            "pressureChange24hHPa": 3.6,
            "pressureChange24hMmHg": 2.7,
            "temperatureChange24hC": -2.1,
            "precipitation24hMm": 0.1,
            "precipitation72hMm": 33.5,
            "cloudCoverPercent": 99,
            "windDirection": "NW",
            "windDirectionDegrees": 336,
            "windSpeedMs": 6.5,
            "windGustsMs": 19.3,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": 0.4,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-29",
          "index": 65,
          "indexRaw": 64.95,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 64,
              "contribution": 10.24,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 80,
              "contribution": 10.4,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 78,
              "contribution": 3.9,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 80,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "cloudy",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.4,
            "airTemperatureC": 1.9,
            "pressureHPa": 1018,
            "pressureMmHg": 764,
            "pressureChange24hHPa": 10.1,
            "pressureChange24hMmHg": 7.6,
            "temperatureChange24hC": 0.2,
            "precipitation24hMm": 0.3,
            "precipitation72hMm": 25.3,
            "cloudCoverPercent": 96,
            "windDirection": "NW",
            "windDirectionDegrees": 332,
            "windSpeedMs": 3.6,
            "windGustsMs": 10.7,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "NW",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": -2.9,
            "moonPhase": "unknown"
          }
        }
      ]
    },
    "north": {
      "summary": "Север Ленинградской области: Приозерск. Реальные погодные данные, гидрология рассчитана косвенно.",
      "forecast": [
        {
          "date": "2026-04-25",
          "index": 71,
          "indexRaw": 71.41,
          "rating": "хорошо",
          "confidence": "medium",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Атмосферное давление.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 68,
              "contribution": 10.88,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 91,
              "contribution": 11.83,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 93,
              "contribution": 4.65,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 91,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Ветер",
              "score": 93,
              "reason": "ветер по направлению и силе благоприятен"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "low_pressure",
            "cloudy",
            "favorable_wind"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 1.8,
            "pressureHPa": 994.4,
            "pressureMmHg": 746,
            "pressureChange24hHPa": -8.2,
            "pressureChange24hMmHg": -6.2,
            "temperatureChange24hC": -2.4,
            "precipitation24hMm": 7,
            "precipitation72hMm": 8.1,
            "cloudCoverPercent": 98,
            "windDirection": "S",
            "windDirectionDegrees": 187,
            "windSpeedMs": 2.2,
            "windGustsMs": 8.8,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "W",
            "windDirectionChangeDegrees": 90,
            "windSpeedChange24hMs": -0.6,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-26",
          "index": 59,
          "indexRaw": 58.99,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 50,
              "contribution": 8,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 90,
              "contribution": 11.7,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 22,
              "contribution": 2.2,
              "status": "мешает",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 58,
              "contribution": 2.9,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 48,
              "contribution": 1.44,
              "status": "мешает",
              "explanation": "уровень или сила потока близки к крайним значениям"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 90,
              "reason": "давление находится в хорошем для ручья диапазоне"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 22,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Уровень воды",
              "score": 48,
              "reason": "уровень или сила потока близки к крайним значениям"
            },
            {
              "factor": "Резкие изменения погоды",
              "score": 50,
              "reason": "есть заметные изменения погоды, прогноз требует осторожности"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при сильной мутности используй крупнее силуэт, яркий контраст и вибрацию; при этом общий потенциал ловли низкий.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен",
            "вода может быть слишком мутной для эффективной визуальной атаки"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "low_pressure",
            "cloudy",
            "unfavorable_wind",
            "strong_gusts",
            "strong_muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.4,
            "airTemperatureC": 1.3,
            "pressureHPa": 992.5,
            "pressureMmHg": 744,
            "pressureChange24hHPa": -1.9,
            "pressureChange24hMmHg": -1.4,
            "temperatureChange24hC": -0.5,
            "precipitation24hMm": 24.4,
            "precipitation72hMm": 31.9,
            "cloudCoverPercent": 100,
            "windDirection": "N",
            "windDirectionDegrees": 5,
            "windSpeedMs": 6.1,
            "windGustsMs": 16.4,
            "waterClarity": "strongly_muddy",
            "waterClarityLabel": "сильно мутная",
            "waterLevel": "high",
            "windDirectionPrevious": "S",
            "windDirectionChangeDegrees": 180,
            "windSpeedChange24hMs": 3.9,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-27",
          "index": 67,
          "indexRaw": 66.76,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 58,
              "contribution": 9.28,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 97,
              "contribution": 12.61,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 58,
              "contribution": 2.9,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 97,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "factor": "Резкие изменения погоды",
              "score": 58,
              "reason": "есть заметные изменения погоды, прогноз требует осторожности"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.8,
            "airTemperatureC": 4.2,
            "pressureHPa": 1004.9,
            "pressureMmHg": 754,
            "pressureChange24hHPa": 12.4,
            "pressureChange24hMmHg": 9.3,
            "temperatureChange24hC": 2.9,
            "precipitation24hMm": 0,
            "precipitation72hMm": 31.9,
            "cloudCoverPercent": 57,
            "windDirection": "N",
            "windDirectionDegrees": 347,
            "windSpeedMs": 6.9,
            "windGustsMs": 15.5,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": 0.8,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-28",
          "index": 69,
          "indexRaw": 69.12,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Ветер.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 63,
              "contribution": 13.86,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 84,
              "contribution": 13.44,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 99,
              "contribution": 12.87,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 48,
              "contribution": 2.4,
              "status": "мешает",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 84,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 99,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Ветер",
              "score": 48,
              "reason": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.",
            "Поведение рыбы: стабильная погода и хорошее давление снижают риск внезапного провала клева, поэтому можно больше перемещаться и проверять активные точки."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.5,
            "airTemperatureC": 2.7,
            "pressureHPa": 1008.3,
            "pressureMmHg": 756,
            "pressureChange24hHPa": 3.4,
            "pressureChange24hMmHg": 2.6,
            "temperatureChange24hC": -1.5,
            "precipitation24hMm": 0,
            "precipitation72hMm": 31.4,
            "cloudCoverPercent": 92,
            "windDirection": "N",
            "windDirectionDegrees": 339,
            "windSpeedMs": 7.9,
            "windGustsMs": 22.8,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": 1,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-29",
          "index": 68,
          "indexRaw": 68.09,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Сезонная фаза.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 64,
              "contribution": 10.24,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 80,
              "contribution": 10.4,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 68,
              "contribution": 3.4,
              "status": "нейтрально",
              "explanation": "ветер нейтральный или умеренно спорный"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 80,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "cloudy",
            "strong_gusts"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 3.1,
            "pressureHPa": 1018,
            "pressureMmHg": 764,
            "pressureChange24hHPa": 9.7,
            "pressureChange24hMmHg": 7.3,
            "temperatureChange24hC": 0.4,
            "precipitation24hMm": 0,
            "precipitation72hMm": 24.4,
            "cloudCoverPercent": 96,
            "windDirection": "NW",
            "windDirectionDegrees": 333,
            "windSpeedMs": 4.7,
            "windGustsMs": 12.1,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": -3.2,
            "moonPhase": "unknown"
          }
        }
      ]
    },
    "north_west": {
      "summary": "Северо-запад Ленинградской области: Выборг. Реальные погодные данные, гидрология рассчитана косвенно.",
      "forecast": [
        {
          "date": "2026-04-25",
          "index": 69,
          "indexRaw": 68.58,
          "rating": "перспективно",
          "confidence": "medium",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Прозрачность воды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 66,
              "contribution": 14.52,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 68,
              "contribution": 10.88,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 91,
              "contribution": 11.83,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 96,
              "contribution": 4.8,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 91,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Ветер",
              "score": 96,
              "reason": "ветер по направлению и силе благоприятен"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "low_pressure",
            "cloudy",
            "favorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.9,
            "airTemperatureC": 3,
            "pressureHPa": 994.1,
            "pressureMmHg": 746,
            "pressureChange24hHPa": -9.3,
            "pressureChange24hMmHg": -7,
            "temperatureChange24hC": -2,
            "precipitation24hMm": 11.6,
            "precipitation72hMm": 13.7,
            "cloudCoverPercent": 98,
            "windDirection": "SW",
            "windDirectionDegrees": 209,
            "windSpeedMs": 3.5,
            "windGustsMs": 12.7,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "NW",
            "windDirectionChangeDegrees": 90,
            "windSpeedChange24hMs": -0.1,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-26",
          "index": 60,
          "indexRaw": 59.6,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 64,
              "contribution": 14.08,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 36,
              "contribution": 5.76,
              "status": "мешает",
              "explanation": "резкие изменения погоды ухудшают прогноз"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 91,
              "contribution": 11.83,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 48,
              "contribution": 2.4,
              "status": "мешает",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 48,
              "contribution": 1.44,
              "status": "мешает",
              "explanation": "уровень или сила потока близки к крайним значениям"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 91,
              "reason": "давление находится в хорошем для ручья диапазоне"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 36,
              "reason": "резкие изменения погоды ухудшают прогноз"
            },
            {
              "factor": "Ветер",
              "score": 48,
              "reason": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "factor": "Уровень воды",
              "score": 48,
              "reason": "уровень или сила потока близки к крайним значениям"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "ветер заметно меняется по направлению или силе, погодный режим нестабилен"
          ],
          "appliedCaps": [],
          "flags": [
            "wind_direction_shift",
            "wind_speed_shift",
            "low_pressure",
            "cloudy",
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.6,
            "airTemperatureC": 2.1,
            "pressureHPa": 994,
            "pressureMmHg": 746,
            "pressureChange24hHPa": -0.1,
            "pressureChange24hMmHg": -0.1,
            "temperatureChange24hC": -0.9,
            "precipitation24hMm": 18.7,
            "precipitation72hMm": 30.3,
            "cloudCoverPercent": 100,
            "windDirection": "N",
            "windDirectionDegrees": 356,
            "windSpeedMs": 7.7,
            "windGustsMs": 16.6,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "high",
            "windDirectionPrevious": "SW",
            "windDirectionChangeDegrees": 135,
            "windSpeedChange24hMs": 4.2,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-27",
          "index": 67,
          "indexRaw": 66.61,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Ветер.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 66,
              "contribution": 14.52,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 58,
              "contribution": 9.28,
              "status": "нейтрально",
              "explanation": "есть заметные изменения погоды, прогноз требует осторожности"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 98,
              "contribution": 12.74,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 48,
              "contribution": 2.4,
              "status": "мешает",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Атмосферное давление",
              "score": 98,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Ветер",
              "score": 48,
              "reason": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "Сильный ветер лучше обходить лесными и закрытыми участками, работая на короткой дистанции.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи."
          ],
          "warnings": [
            "давление резко растет после смены погоды, это неблагоприятный сигнал"
          ],
          "appliedCaps": [],
          "flags": [
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.9,
            "airTemperatureC": 4.6,
            "pressureHPa": 1006.8,
            "pressureMmHg": 755,
            "pressureChange24hHPa": 12.8,
            "pressureChange24hMmHg": 9.6,
            "temperatureChange24hC": 2.5,
            "precipitation24hMm": 0,
            "precipitation72hMm": 30.3,
            "cloudCoverPercent": 51,
            "windDirection": "N",
            "windDirectionDegrees": 346,
            "windSpeedMs": 7.9,
            "windGustsMs": 14.7,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": 0.2,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-28",
          "index": 71,
          "indexRaw": 71.31,
          "rating": "хорошо",
          "confidence": "low",
          "summary": "Условия хорошие, но стоит следить за локальными особенностями ручья. Главный плюс: Резкие изменения погоды.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 84,
              "contribution": 13.44,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 100,
              "contribution": 13,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 52,
              "contribution": 5.2,
              "status": "нейтрально",
              "explanation": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 92,
              "contribution": 7.36,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 58,
              "contribution": 2.9,
              "status": "нейтрально",
              "explanation": "ветер ухудшает условия или связан с неблагоприятным режимом"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Резкие изменения погоды",
              "score": 84,
              "reason": "погода достаточно стабильна"
            },
            {
              "factor": "Атмосферное давление",
              "score": 100,
              "reason": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "factor": "Освещенность",
              "score": 92,
              "reason": "освещенность мягкая и не делает рыбу излишне осторожной"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 52,
              "reason": "мутность или чрезмерная прозрачность ухудшают условия"
            },
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "factor": "Ветер",
              "score": 58,
              "reason": "ветер ухудшает условия или связан с неблагоприятным режимом"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: из-за мутности форель видит хуже, поэтому можно подходить ближе, но заброс должен попадать точнее к укрытиям, кромкам струи и спокойным карманам.",
            "Модель ловли: видимость снижена, поэтому ставка на заметность. Используй вращающиеся блесны, небольшие колебалки или воблеры с выраженной игрой, веди приманку чуть медленнее и ближе к перспективным укрытиям.",
            "Приманки: при умеренной мутности добавь контраст, яркую точку атаки, вращалку с вибрацией или воблер с более заметной игрой.",
            "При северном или восточном ветре снизь ожидания и выбирай участки с более спокойной подачей.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.",
            "Поведение рыбы: стабильная погода и хорошее давление снижают риск внезапного провала клева, поэтому можно больше перемещаться и проверять активные точки."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "unfavorable_wind",
            "strong_gusts",
            "muddy_risk"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 2.9,
            "pressureHPa": 1010.4,
            "pressureMmHg": 758,
            "pressureChange24hHPa": 3.6,
            "pressureChange24hMmHg": 2.7,
            "temperatureChange24hC": -1.7,
            "precipitation24hMm": 0,
            "precipitation72hMm": 30.3,
            "cloudCoverPercent": 77,
            "windDirection": "N",
            "windDirectionDegrees": 343,
            "windSpeedMs": 6.9,
            "windGustsMs": 18.5,
            "waterClarity": "moderately_muddy",
            "waterClarityLabel": "умеренно мутная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 0,
            "windSpeedChange24hMs": -1,
            "moonPhase": "unknown"
          }
        },
        {
          "date": "2026-04-29",
          "index": 70,
          "indexRaw": 70.38,
          "rating": "перспективно",
          "confidence": "low",
          "summary": "Есть рабочие условия, но прогноз не без слабых мест. Главный риск: Сезонная фаза.",
          "factors": [
            {
              "id": "waterTemperature",
              "label": "Температура воды",
              "weight": 0.22,
              "weightPercent": 22,
              "score": 65,
              "contribution": 14.3,
              "status": "нейтрально",
              "explanation": "температура воды рабочая, но не идеальная"
            },
            {
              "id": "season",
              "label": "Сезонная фаза",
              "weight": 0.21,
              "weightPercent": 21,
              "score": 55,
              "contribution": 11.55,
              "status": "нейтрально",
              "explanation": "сезонная фаза ограничивает активность рыбы"
            },
            {
              "id": "weatherChange",
              "label": "Резкие изменения погоды",
              "weight": 0.16,
              "weightPercent": 16,
              "score": 76,
              "contribution": 12.16,
              "status": "помогает",
              "explanation": "погода достаточно стабильна"
            },
            {
              "id": "pressure",
              "label": "Атмосферное давление",
              "weight": 0.13,
              "weightPercent": 13,
              "score": 79,
              "contribution": 10.27,
              "status": "помогает",
              "explanation": "давление находится в хорошем для ручья диапазоне"
            },
            {
              "id": "waterClarity",
              "label": "Прозрачность воды",
              "weight": 0.1,
              "weightPercent": 10,
              "score": 84,
              "contribution": 8.4,
              "status": "помогает",
              "explanation": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "id": "light",
              "label": "Освещенность",
              "weight": 0.08,
              "weightPercent": 8,
              "score": 78,
              "contribution": 6.24,
              "status": "помогает",
              "explanation": "освещенность мягкая и не делает рыбу излишне осторожной"
            },
            {
              "id": "wind",
              "label": "Ветер",
              "weight": 0.05,
              "weightPercent": 5,
              "score": 78,
              "contribution": 3.9,
              "status": "помогает",
              "explanation": "ветер по направлению и силе благоприятен"
            },
            {
              "id": "waterLevel",
              "label": "Уровень воды",
              "weight": 0.03,
              "weightPercent": 3,
              "score": 82,
              "contribution": 2.46,
              "status": "помогает",
              "explanation": "уровень воды без крайних отклонений"
            },
            {
              "id": "moon",
              "label": "Луна",
              "weight": 0.02,
              "weightPercent": 2,
              "score": 55,
              "contribution": 1.1,
              "status": "нейтрально",
              "explanation": "лунный фактор не поддерживает прогноз"
            }
          ],
          "positiveDrivers": [
            {
              "factor": "Прозрачность воды",
              "score": 84,
              "reason": "прозрачность воды помогает рыбе видеть приманку"
            },
            {
              "factor": "Уровень воды",
              "score": 82,
              "reason": "уровень воды без крайних отклонений"
            }
          ],
          "negativeDrivers": [
            {
              "factor": "Сезонная фаза",
              "score": 55,
              "reason": "сезонная фаза ограничивает активность рыбы"
            }
          ],
          "recommendations": [
            "Когда ловить: лучше день и ближе к вечеру, когда вода успевает немного прогреться; раннее утро менее перспективно.",
            "Дальность и скрытность: слегка окрашенная вода или рябь маскируют рыболова. Дистанция нужна умеренная, можно активнее проверять ближние карманы перед дальними забросами.",
            "Модель ловли: вода холодная, рыба может быть вялой. Лучше медленная подача: микроколебалка на снос, силикон на легкой головке, короткие паузы и облов глубоких ям.",
            "Проводка: при холодной воде лучше искать более теплые дневные окна, вести медленно и давать приманке паузы у дна или на границе струи.",
            "Поведение рыбы: стабильная погода и хорошее давление снижают риск внезапного провала клева, поэтому можно больше перемещаться и проверять активные точки."
          ],
          "warnings": [],
          "appliedCaps": [],
          "flags": [
            "stable_weather",
            "cloudy",
            "strong_gusts"
          ],
          "raw": {
            "estimatedWaterTemperatureC": 6.7,
            "airTemperatureC": 3.3,
            "pressureHPa": 1019.1,
            "pressureMmHg": 764,
            "pressureChange24hHPa": 8.7,
            "pressureChange24hMmHg": 6.5,
            "temperatureChange24hC": 0.4,
            "precipitation24hMm": 0,
            "precipitation72hMm": 18.7,
            "cloudCoverPercent": 95,
            "windDirection": "NW",
            "windDirectionDegrees": 336,
            "windSpeedMs": 3.9,
            "windGustsMs": 12.2,
            "waterClarity": "slightly_colored_clear",
            "waterClarityLabel": "слегка окрашенная прозрачная",
            "waterLevel": "slightly_high",
            "windDirectionPrevious": "N",
            "windDirectionChangeDegrees": 45,
            "windSpeedChange24hMs": -3,
            "moonPhase": "unknown"
          }
        }
      ]
    }
  }
};
