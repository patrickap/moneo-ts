[private]
default:
  @just --list

[private]
get_version:
 @npm pkg get version | awk -F'"' '{print $2}'

[private]
set_version type:
  @npm version {{type}} --no-git-tag-version

[private]
npm_publish:
  @npm publish --access public

[private]
git_publish:
  @git add .
  @git commit -m "chore(release): v$(just get_version)"
  @git push
  @git tag -a "v$(just get_version)" -m "Release v$(just get_version)"
  @git push --tags origin

[private]
release_patch:
  @just set_version patch
  @just npm_publish
  @just git_publish

[private]
release_minor:
  @just set_version minor
  @just npm_publish
  @just git_publish

[private]
release_major:
  @just set_version major
  @just npm_publish
  @just git_publish

[private]
release_auto:
  #!/usr/bin/env bash
  set -euo pipefail
  latest_tag=$(git describe --tags --abbrev=0)
  new_commits=$(git log $latest_tag..HEAD --pretty=format:"%B")

  if echo "$new_commits" | grep -q "BREAKING"; then
    just release_major;
    exit 0
  elif echo "$new_commits" | grep -q "^feat"; then
    just release_minor;
    exit 0
  else
    just release_patch;
    exit 0
  fi;

release type="auto":
  @just release_{{type}}
