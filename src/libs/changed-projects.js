const { getRushChangePath, getRushChangeFiles, readChangeFile } = require('./utils')

module.exports = async () => {
  const rushChangeFilesPath = getRushChangePath()
  const changeFiles = getRushChangeFiles(rushChangeFilesPath)

  const changedPackages = []
  changeFiles.forEach((changeFilePath) => {
    const changeRequest = readChangeFile(changeFilePath)
    if (!changedPackages.includes(changeRequest.packageName)) {
      changedPackages.push(changeRequest.packageName)
    }
  })

  console.log('Rush Changed Projects: ', changedPackages)
  return changedPackages
}
