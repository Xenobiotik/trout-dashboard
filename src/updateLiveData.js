const { spawnSync } = require("child_process");
const path = require("path");

const rootDir = path.join(__dirname, "..");

const steps = [
  {
    label: "Скачиваю свежую погоду",
    script: "fetchWeatherSnapshot.js"
  },
  {
    label: "Пересчитываю погодные условия в факторы",
    script: "generateLiveConditions.js"
  },
  {
    label: "Считаю индекс и рекомендации",
    script: "generateLiveResults.js"
  },
  {
    label: "Обновляю данные для дашборда",
    script: "generateLiveAppData.js"
  }
];

for (const step of steps) {
  console.log(`\n${step.label}...`);

  const result = spawnSync(process.execPath, [path.join(rootDir, "src", step.script)], {
    cwd: rootDir,
    encoding: "utf8"
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    console.error(`\nШаг не выполнен: ${step.script}`);
    process.exit(result.status || 1);
  }
}

console.log("\nГотово. Обнови страницу дашборда и выбери режим «Реальная погода».");
