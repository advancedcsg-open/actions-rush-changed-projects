const { join } = require('path')

describe('utils', () => {
  afterEach(async () => {
    jest.resetModules() // Most important - it clears the cache
  })

  it('getRushChangePath', async () => {
    const { getRushChangePath } = require('../../../src/libs/utils')

    const result = getRushChangePath()

    expect(result).toEqual('common/changes')
  })

  it('getRushChangeFiles - files exist', async () => {
    const { getRushChangeFiles } = require('../../../src/libs/utils')

    const changeFilesPath = join(__dirname, '..', '..', 'fixtures', 'changes')
    const changedFiles = getRushChangeFiles(changeFilesPath)

    expect(changedFiles).toHaveLength(4)
  })

  it('getRushChangeFiles - files empty', async () => {
    const { getRushChangeFiles } = require('../../../src/libs/utils')

    const changeFilesPath = join(__dirname, '..', '..', 'fixtures', 'nochanges')
    const changedFiles = getRushChangeFiles(changeFilesPath)

    expect(changedFiles).toHaveLength(0)
  })
})
