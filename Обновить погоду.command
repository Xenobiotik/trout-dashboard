#!/bin/zsh
cd "$(dirname "$0")"
node src/updateLiveData.js
echo ""
echo "Можно закрыть это окно и обновить страницу дашборда."
read -k 1 "?Нажми любую клавишу для закрытия..."
