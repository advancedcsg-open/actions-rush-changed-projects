const process = require('process')
const cp = require('child_process')
const { join } = require('path')

describe('test runs', () => {
  const OLD_ENV = process.env

  beforeEach(async () => {
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterEach(async () => {
    jest.resetModules() // Most important - it clears the cache
    process.env = OLD_ENV // Restore old environment
  })

  // it('test action executes - default', async () => {
  //   const fixturePath = join(__dirname, '..', 'fixtures')

  //   const action = join(process.cwd(), 'src', 'main.js')

  //   const result = cp.execSync(`node ${action}`, { env: process.env, shell: false, cwd: fixturePath })
  //   const results = result.toString().trim().split(/\r\n|\r|\n/) // split on new line
  //   expect(results).toContain("::set-output name=changed-projects::'[\"@advanced/example-1\",\"@advanced/example-2\",\"@advanced/example-3\"]'")
  // })

  // it('test action executes - exclude dependant projects', async () => {
  //   const fixturePath = join(__dirname, '..', 'fixtures')

  //   const action = join(process.cwd(), 'src', 'main.js')

  //   process.env['INPUT_EXCLUDE-DEPENDANT-PROJECTS'] = true

  //   const result = cp.execSync(`node ${action}`, { env: process.env, shell: false, cwd: fixturePath })
  //   const results = result.toString().trim().split(/\r\n|\r|\n/) // split on new line
  //   expect(results).toContain("::set-output name=changed-projects::'[\"@advanced/example-1\",\"@advanced/example-2\"]'")
  // })

  // it('test action executes - include dependant projects', async () => {
  //   const fixturePath = join(__dirname, '..', 'fixtures')

  //   const action = join(process.cwd(), 'src', 'main.js')

  //   process.env['INPUT_EXCLUDE-DEPENDANT-PROJECTS'] = false

  //   const result = cp.execSync(`node ${action}`, { env: process.env, shell: false, cwd: fixturePath })
  //   const results = result.toString().trim().split(/\r\n|\r|\n/) // split on new line
  //   expect(results).toContain("::set-output name=changed-projects::'[\"@advanced/example-1\",\"@advanced/example-2\",\"@advanced/example-3\"]'")
  // })

  // it('test action executes - failure', async () => {
  //   const fixturePath = join(__dirname, '..', 'fixtures', 'norushfolder')

  //   const action = join(process.cwd(), 'src', 'main.js')

  //   try {
  //     cp.execSync(`node ${action}`, { env: process.env, shell: false, cwd: fixturePath })
  //   } catch (err) {
  //     const errors = err.stdout.toString().trim().split(/\r\n|\r|\n/)
  //     expect(errors).toContain(`::error::Cannot detect rush.json file at ${fixturePath}`)
  //   }
  // })

  it('test action as module executes - default', async () => {
    jest.spyOn(process, 'cwd').mockReturnValue(join(__dirname, '..', 'fixtures'))

    const actionsCore = require('@actions/core')
    jest.mock('@actions/core')

    const action = require('../../src/main')
    await action()
    expect(actionsCore.setOutput).toHaveBeenCalledWith('changed-projects', "'[\"@advanced/example-1\",\"@advanced/example-2\",\"@advanced/example-3\"]'")
  })

  it('test action as module executes - failed', async () => {
    const noRushPath = join(__dirname, '..', 'fixtures', 'norushfolder')
    jest.spyOn(process, 'cwd').mockReturnValue(noRushPath)

    const actionsCore = require('@actions/core')
    jest.mock('@actions/core')

    const action = require('../../src/main')
    await action()

    expect(actionsCore.setFailed).toHaveBeenCalledWith(`Cannot detect rush.json file at ${noRushPath}`)
  })
})
