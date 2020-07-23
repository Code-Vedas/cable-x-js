#!/bin/bash

set -euo pipefail

npm install -g yarn
yarn
yarn build
yarn test-headless
npx semantic-release --dry-run
