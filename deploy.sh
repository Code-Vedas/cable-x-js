#!/bin/bash

set -euo pipefail

npm install -g yarn
yarn
yarn build
npx semantic-release
