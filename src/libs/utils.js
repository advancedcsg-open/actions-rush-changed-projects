const { join } = require('path')
const glob = require('glob')
const { existsSync, promises: { readFile } } = require('fs')
const stripJsonComments = require('./strip-json-comments')

const readJsonFile = async (filePath) => {
  const content = await readFile(filePath, 'utf8')
  return JSON.parse(stripJsonComments(content))
}

const getPackagesFromChanges = async (rushChangePath) => {
  const changeFiles = glob.sync(`${rushChangePath}/**/*.json`)

  const changedPackages = []
  for (const changeFilePath of changeFiles) {
    const changeRequest = await readJsonFile(changeFilePath)
    if (!changedPackages.includes(changeRequest.packageName)) {
      changedPackages.push(changeRequest.packageName)
    }
  }
  return changedPackages
}

const getPackagesPaths = async (rushRootPath) => {
  const rushJsonPath = join(rushRootPath, 'rush.json')

  if (!existsSync(rushJsonPath)) {
    throw new Error(`Cannot detect rush.json file at ${rushRootPath}`)
  }

  const rushJson = await readJsonFile(join(rushRootPath, 'rush.json'))

  const paths = []
  for (const project of rushJson.projects) {
    paths.push({
      packageName: project.packageName,
      packagePath: join(rushRootPath, project.projectFolder),
      packageVersionPolicy: project.versionPolicyName
    })
  }
  return paths
}

const getAllChanges = async ({ rushChangePath, packagePaths, options = {} }) => {
  // Identify changed packages from change logs
  var changedPackages = await getPackagesFromChanges(rushChangePath)
  // Filter projects by version policy
  if (options.versionPolicy != "") {
    console.log("versionPolicy :", options.versionPolicy)
    const versionPolicyPackages = packagePaths.filter(project => project.packageVersionPolicy == options.versionPolicy).map(project => project.packageName)
    console.log("versionPolicyPackages :", versionPolicyPackages)
    changedPackages = changedPackages.filter(project => versionPolicyPackages.includes(project))
  }
  // Start off with the changed packages
  const allChanges = [...changedPackages]

  // Exclude the dependant projects if specified. By default we include them
  if ((!options.excludeDependantProjects) || (options.excludeDependantProjects && options.excludeDependantProjects !== 'true')) {
    // Check through all rush packages
    for (const { packageName, packagePath } of packagePaths) {
      // Read the package.json
      const packageJsonPath = join(packagePath, 'package.json')
      const packageJsonContent = await readJsonFile(packageJsonPath)

      // Build up a list of all the package dependencies
      const prodDependencies = (packageJsonContent.dependencies) ? Object.keys(packageJsonContent.dependencies) : []
      const devDependencies = (packageJsonContent.devDependencies) ? Object.keys(packageJsonContent.devDependencies) : []
      const allDependencies = [...prodDependencies, ...devDependencies]

      // Check to see if any of the changedPackages are in the dependencies
      const hasChangedPackage = allDependencies.some((dependencyName) => changedPackages.includes(dependencyName))
      if (hasChangedPackage && !allChanges.includes(packageName)) {
        allChanges.push(packageName)
      }
    }
  }
  return allChanges
}

module.exports = {
  readJsonFile,
  getPackagesFromChanges,
  getPackagesPaths,
  getAllChanges
}
