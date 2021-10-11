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

  it('test action executes', async () => {
    const action = join(process.cwd(), 'src', 'main.js')

    const result = cp.execSync(`node ${action}`, { env: process.env }).toString()
    const results = result.trim().split(/\r\n|\r|\n/) // split on new line
    expect(results).toContain('::set-output name=changed-projects::[]')
  })

  it('test action - no changes', async () => {
    const actionsCore = require('@actions/core')
    jest.mock('@actions/core')

    await require('../../src/main')

    console.log(actionsCore.setOutput)
    expect(actionsCore.setOutput).toHaveBeenCalledWith('changed-projects', '[]')
  })

  it('test action - with changes', async () => {
    const actionsCore = require('@actions/core')
    jest.mock('@actions/core')

    const changes = ['@advanced/example-1', '@advanced/example-2']
    const changedProjects = require('../../src/libs/changed-projects')
    jest.mock('../../src/libs/changed-projects')
    changedProjects.mockReturnValue(changes)

    await require('../../src/main')

    expect(actionsCore.setOutput).toHaveBeenCalledWith('changed-projects', JSON.stringify(changes))
  })

  it('test action - failed', async () => {
    const actionsCore = require('@actions/core')
    jest.mock('@actions/core')

    const errorMsg = 'Something went wrong'
    const changedProjects = require('../../src/libs/changed-projects')
    jest.mock('../../src/libs/changed-projects')
    changedProjects.mockImplementation(() => {
      throw new Error(errorMsg)
    })

    await require('../../src/main')

    expect(actionsCore.setFailed).toHaveBeenCalledWith(errorMsg)
  })
})
