#!/usr/bin/env bash
set -e

HEAD=$(git merge-base origin/main HEAD)

if [[ "${PUSH}" = "true" ]]; then
  yarn
  yarn nx reset
  yarn build:check
  yarn nx affected:lint --base=${HEAD} --parallel=6 --fix --quiet
fi

yarn nx format:write --base=${HEAD} --parallel=6 --quiet --loglevel=error

if [[ "${PUSH}" = "true" && $(git status --porcelain) ]]; then
  echo Lint problem: Please commit fixed files
  exit 255
fi
