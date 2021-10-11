const { join } = require('path')
const glob = require('glob')
const { readFileSync } = require('fs')

const getRushChangePath = () => {
  return join('common', 'changes').replace(/\\/g, '/')
}

const getRushChangeFiles = (changeFilesPath) => {
  return glob.sync(`${changeFilesPath}/**/*.json`)
}

const readChangeFile = (changeFilePath) => {
  return JSON.parse(readFileSync(changeFilePath, 'utf8'))
}

module.exports = {
  getRushChangePath,
  getRushChangeFiles,
  readChangeFile
}
