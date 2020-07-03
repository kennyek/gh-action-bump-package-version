## gh-action-bump-package-version

Bump package.json version depending on version in newly created release branch.

### Workflow

* Get version number from new branch.
* Clone repo to be able to read package-lock.json
* Update version in package.json and package-lock.json
* Push the new package.json and package-lock.json to the created release branch.

### Usage:

Add workflow to GitHub Actions:

```yml
on:
  create:
    branches:
      - release/**

jobs:
  bump_package_version:
    runs-on: ubuntu-latest
    name: Bump package version
    steps:
      - uses: actions/checkout@v2
      - name: Bump package version
        uses: kennyek/gh-action-bump-package-version@master
        env:
          USERNAME: "github-username-with-repo-access"
          PASSWORD: "access-token-for-user-with-repo-access"
```
