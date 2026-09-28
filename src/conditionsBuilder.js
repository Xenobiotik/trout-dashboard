const engine = require("../app/online-engine");

module.exports = {
  buildConditionsFromWeather: engine.buildConditions,
  buildDayConditions: (_region, day, index, days) => engine.buildDayConditions(day, index, days),
  estimateWaterTemperature: engine.estimateWaterTemperature,
  estimateWaterClarity: engine.estimateWaterClarity,
  estimateWaterLevel: engine.estimateWaterLevel
};
