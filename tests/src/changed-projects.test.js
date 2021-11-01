const { join } = require('path')

describe('changed projects', () => {
  jest.setTimeout(100000)

  beforeEach(async () => {
    jest.spyOn(process, 'cwd').mockReturnValue(join(__dirname, '..', 'fixtures'))
  })
  afterEach(async () => {
    jest.resetAllMocks()
    jest.resetModules() // Most important - it clears the cache
  })

  it('changed projects - valid', async () => {
    const changedProjects = require('../../src/changed-projects')
    const result = await changedProjects()

    expect(Array.isArray(result)).toEqual(true)
    expect(result).toHaveLength(3)
  })

  it('changed projects - error', async () => {
    const { getPackagesPaths } = require('../../src/libs/utils')
    jest.mock('../../src/libs/utils')

    getPackagesPaths.mockImplementation(() => {
      throw new Error('Cannot detect rush.json file')
    })
    const changedProjects = require('../../src/changed-projects')

    await expect(async () => changedProjects()).rejects.toThrow('Cannot detect rush.json file')
  })
})
