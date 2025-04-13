#!/usr/bin/sh
set -euxo pipefail

function get_version() {
  npm pkg get version | awk -F'"' '{print $2}'
}

function set_version() {
  local type="${1}"

  npm version "${type}" --no-git-tag-version
}

function npm_publish() {
  npm publish --access public
}

function git_publish() {
  local version="$(get_version)"

  git add .
  git commit -m "chore(release): v${version}"
  git push
  git tag -a "v${version}" -m "Release v${version}"
  git push --tags origin
}

function main() {
  local prev_tag="$(git describe --tags --abbrev=0)"
  local commits="$(git log ${prev_tag}..HEAD --pretty=format:'%B')"

  if echo "${commits}" | grep -q "BREAKING"; then
    set_version major
  elif echo "${commits}" | grep -q "^feat"; then
    set_version minor
  else
    set_version patch
  fi

  npm_publish
  git_publish
}

main "${@:-}"
