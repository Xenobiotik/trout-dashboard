const engine = require("../app/online-engine");

module.exports = {
  FACTOR_WEIGHTS: engine.FACTOR_WEIGHTS,
  FACTOR_LABELS: engine.FACTOR_LABELS,
  calculateIndex: engine.calculateIndex,
  calculateFactorContributions: engine.calculateFactorContributions,
  getRating: engine.getRating
};
