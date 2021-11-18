const { join } = require('path')

describe('utils', () => {
  jest.setTimeout(100000)

  afterEach(async () => {
    jest.resetModules() // Most important - it clears the cache
  })

  it('readJsonFile - files exist', async () => {
    const { readJsonFile } = require('../../../src/libs/utils')

    const rushJsonPath = join(__dirname, '..', '..', 'fixtures', 'rush.json')
    const rushJsonContent = await readJsonFile(rushJsonPath)

    expect(rushJsonContent.rushVersion).toEqual('5.54.0')
    expect(rushJsonContent.projects.length).toBeGreaterThan(0)
  })

  it('getPackagesFromChanges - files exist', async () => {
    const { getPackagesFromChanges } = require('../../../src/libs/utils')

    const changeFilesPath = join(__dirname, '..', '..', 'fixtures', 'common', 'changes')
    const changedFiles = await getPackagesFromChanges(changeFilesPath)

    expect(changedFiles).toHaveLength(2)
    expect(changedFiles).toContain('@advanced/example-1')
    expect(changedFiles).toContain('@advanced/example-2')
  })

  it('getPackagesFromChanges - files empty', async () => {
    const { getPackagesFromChanges } = require('../../../src/libs/utils')

    const changeFilesPath = join(__dirname, '..', '..', 'fixtures', 'common', 'nochanges')
    const changedFiles = await getPackagesFromChanges(changeFilesPath)

    expect(changedFiles).toHaveLength(0)
  })

  it('getPackagesPaths - valid', async () => {
    const { getPackagesPaths } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures')
    const packagePaths = await getPackagesPaths(rushRootPath)

    expect(packagePaths).toHaveLength(4)
    for (let index = 0; index < packagePaths.length; index++) {
      const packageId = index + 1
      const packagePath = packagePaths[index]
      expect(packagePath).toMatchObject({
        packageName: `@advanced/example-${packageId}`,
        packagePath: join(rushRootPath, 'packages', `example${packageId}`)
      })
    }
  })

  it('getPackagesPaths - error', async () => {
    const { getPackagesPaths } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures', 'norushfolder')
    await expect(async () => getPackagesPaths(rushRootPath)).rejects.toThrow(`Cannot detect rush.json file at ${rushRootPath}`)
  })

  it('getAllChanges - default', async () => {
    const { getPackagesPaths, getAllChanges } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures')
    const rushChangePath = join(__dirname, '..', '..', 'fixtures', 'common', 'changes')

    const packagePaths = await getPackagesPaths(rushRootPath)
    const allChangedPackages = await getAllChanges({ rushChangePath, packagePaths })

    expect(allChangedPackages).toHaveLength(3)

    // Files from changelogs
    expect(allChangedPackages).toContain('@advanced/example-1')
    expect(allChangedPackages).toContain('@advanced/example-2')

    // Detected as a dependency that consumes a changed package
    expect(allChangedPackages).toContain('@advanced/example-3')
  })

  it('getAllChanges - excludeDependantProjects = false', async () => {
    const { getPackagesPaths, getAllChanges } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures')
    const rushChangePath = join(__dirname, '..', '..', 'fixtures', 'common', 'changes')

    const options = {
      excludeDependantProjects: 'false'
    }

    const packagePaths = await getPackagesPaths(rushRootPath)
    const allChangedPackages = await getAllChanges({ rushChangePath, packagePaths, options })

    expect(allChangedPackages).toHaveLength(3)

    // Files from changelogs
    expect(allChangedPackages).toContain('@advanced/example-1')
    expect(allChangedPackages).toContain('@advanced/example-2')

    // Detected as a dependency that consumes a changed package
    expect(allChangedPackages).toContain('@advanced/example-3')
  })

  it('getAllChanges - excludeDependantProjects = true', async () => {
    const { getPackagesPaths, getAllChanges } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures')
    const rushChangePath = join(__dirname, '..', '..', 'fixtures', 'common', 'changes')

    const options = {
      excludeDependantProjects: 'true'
    }

    const packagePaths = await getPackagesPaths(rushRootPath)
    const allChangedPackages = await getAllChanges({ rushChangePath, packagePaths, options })

    expect(allChangedPackages).toHaveLength(2)

    // Files from changelogs
    expect(allChangedPackages).toContain('@advanced/example-1')
    expect(allChangedPackages).toContain('@advanced/example-2')

    // Detected as a dependency that consumes a changed package
    expect(allChangedPackages).not.toContain('@advanced/example-3')
  })

  it('getAllChanges - versionPolicy = apps - excludeDependantProjects = false', async () => {
    const { getPackagesPaths, getAllChanges } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures')
    const rushChangePath = join(__dirname, '..', '..', 'fixtures', 'common', 'changes')

    const options = {
      excludeDependantProjects: 'false',
      versionPolicy: 'apps'
    }

    const packagePaths = await getPackagesPaths(rushRootPath)
    const allChangedPackages = await getAllChanges({ rushChangePath, packagePaths, options })

    expect(allChangedPackages).toHaveLength(2)

    // Files from changelogs
    expect(allChangedPackages).toContain('@advanced/example-1')

    // Detected as a dependency that consumes a changed package
    expect(allChangedPackages).toContain('@advanced/example-3')
  })
  it('getAllChanges - versionPolicy = apps - excludeDependantProjects = true', async () => {
    const { getPackagesPaths, getAllChanges } = require('../../../src/libs/utils')

    const rushRootPath = join(__dirname, '..', '..', 'fixtures')
    const rushChangePath = join(__dirname, '..', '..', 'fixtures', 'common', 'changes')

    const options = {
      excludeDependantProjects: 'true',
      versionPolicy: 'apps'
    }

    const packagePaths = await getPackagesPaths(rushRootPath)
    const allChangedPackages = await getAllChanges({ rushChangePath, packagePaths, options })

    expect(allChangedPackages).toHaveLength(1)

    // Files from changelogs
    expect(allChangedPackages).toContain('@advanced/example-1')
  })
})
