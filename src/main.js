const core = require('@actions/core')

const changedProjects = require('./libs/changed-projects')

async function run () {
  try {
    const changedProjectsArray = await changedProjects()

    core.setOutput('changed-projects', `'${JSON.stringify(changedProjectsArray)}'`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
