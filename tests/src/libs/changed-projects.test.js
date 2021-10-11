const { join } = require('path')
const utils = require('../../../src/libs/utils')

describe('changed projects', () => {
  afterEach(async () => {
    jest.resetAllMocks()
    jest.resetModules() // Most important - it clears the cache
  })

  it('changed projects - found two items', async () => {
    const changeFilesPath = join(__dirname, '..', '..', 'fixtures', 'changes')
    utils.getRushChangePath = jest.fn().mockReturnValue(changeFilesPath)
    const changedProjects = require('../../../src/libs/changed-projects')

    const result = await changedProjects()

    expect(Array.isArray(result)).toEqual(true)
    expect(result).toHaveLength(2)
  })

  it('changed projects - found two items', async () => {
    const changeFilesPath = join(__dirname, '..', '..', 'fixtures', 'nochanges')
    utils.getRushChangePath = jest.fn().mockReturnValue(changeFilesPath)
    const changedProjects = require('../../../src/libs/changed-projects')

    const result = await changedProjects()

    expect(Array.isArray(result)).toEqual(true)
    expect(result).toHaveLength(0)
  })
})
