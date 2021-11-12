const { join } = require('path')
const { getPackagesPaths, getAllChanges } = require('./libs/utils')

module.exports = async (options = {}) => {
  const rushRootPath = join(process.cwd())
  const rushChangePath = join(process.cwd(), 'common', 'changes')

  const packagePaths = await getPackagesPaths(rushRootPath)
  if (options.versionPolicy != undefined) {
    packagePaths = packagePaths.filter(project => project.packageVersionPolicy == options.versionPolicy)
  }
  const allChangedPackages = await getAllChanges({ rushChangePath, packagePaths, options })

  console.log('Rush Changed Projects: ', allChangedPackages)
  return allChangedPackages
}
