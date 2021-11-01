const process = require('process')
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
