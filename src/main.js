const core = require('@actions/core')

const changedProjects = require('./changed-projects')

async function run() {
  try {
    const options = {
      excludeDependantProjects: core.getInput('exclude-dependant-projects'),
      versionPolicy: core.getInput('version-policy'),
      workingDirectory: core.getInput('working-directory')
    }
    const changedProjectsArray = await changedProjects(options)

    core.setOutput('changed-projects', `'${JSON.stringify(changedProjectsArray)}'`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = run

if (require.main === module) {
  run()
}
