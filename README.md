# Rush Changed Projects Action
<p align="center">
  <a href="https://standardjs.com"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"></a>
  <a href="https://github.com/advancedcsg-open/actions-rush-changed-projects/actions"><img alt="javscript-action status" src="https://github.com/advancedcsg-open/actions-rush-changed-projects/workflows/units-test/badge.svg"></a>
</p>

---

Used to in combination with `rush change` files to detect changes.

## Usage

### Pre-requisites
---
This action requires rush version 5.47.0 or newer.

### Outputs
---
#### `changed-projects`
A list of the changed projects. Contains the rush.json `packageName` of each project.

### Example
---
```yaml
# .github/workflows/rush.yml
name: Rush Changed Projects
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Rush Install
        uses: advancedcsg-open/actions-rush
      - name: Rush Changed Projects
        uses: advancedcsg-open/actions-rush-changed-projects
        id: rush-changed-projects
      - name: Display Changes
        run: |
          for PACKAGE in $(echo ${{ steps.rush-changed-projects.outputs.changed-projects}} | jq -r .[])
            do
              echo $PACKAGE
            done
```

### License

actions-rush-changed-projects is licensed under the MIT License. See the LICENSE file for more info.