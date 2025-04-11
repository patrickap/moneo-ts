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

release type:
  @just release_{{type}}
