#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="xmanager-dev-3018"

cd "$ROOT_DIR"

echo "[1/2] Restarting PM2 app: $APP_NAME"
pm2 startOrRestart ecosystem.config.cjs --only "$APP_NAME"

echo "[2/2] Saving PM2 process list"
pm2 save

echo "Dev host restart complete."
