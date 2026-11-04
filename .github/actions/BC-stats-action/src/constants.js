const path = require('path')

const configPath = '.github/actions/BC-stats-action';
const workDir = path.join(__dirname, '../.work')
const mainRepoName = 'main-repo'
const diffRepoName = 'diff-repo'
const mainRepoDir = path.join(workDir, mainRepoName)
const diffRepoDir = path.join(workDir, diffRepoName)
const diffingDir = path.join(workDir, 'diff')
const npmEnvValues = {
  NPM_CACHE_FOLDER: path.join(workDir, 'npm-cache'),
}

module.exports = {
  configPath,
  workDir,
  diffingDir,
  mainRepoName,
  diffRepoName,
  mainRepoDir,
  diffRepoDir,
  npmEnvValues,
}
