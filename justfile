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
get_release_type:
  #!/usr/bin/env bash
  set -euo pipefail
  latest_tag=$(git describe --tags --abbrev=0)
  commits=$(git log $latest_tag..HEAD --pretty=format:"%B")

  if echo "$commits" | grep -q "BREAKING"; then
    release_type="major";
  elif echo "$commits" | grep -q "^feat"; then
    release_type="minor";
  else
    release_type="patch";
  fi;

  echo "Determined release type: $release_type"

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

release type:
  @just release_{{type}}
