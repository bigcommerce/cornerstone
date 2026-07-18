const path = require('path')
const exec = require('../util/exec')
const getDirSize = require('./get-dir-size')
const collectStats = require('./collect-stats')
const { mainRepoDir, diffRepoDir, npmEnvValues } = require('../constants')

async function runConfig(statsConfig) {
  let result = {}

  const repoStatsMapper = {
    [mainRepoDir]: 'mainRepoStats',
    [diffRepoDir]: 'diffRepoStats',
  }

  for (const dir of [mainRepoDir, diffRepoDir]) {
    const nodeModulesSize = await getDirSize(path.join(dir, 'node_modules'))

    const buildStart = new Date().getTime()
    await exec(`cd ${dir} && ${statsConfig.appBuildCommand}`, false, { env: npmEnvValues })
    const buildDuration = new Date().getTime() - buildStart

    const collectedStats = await collectStats(statsConfig, dir);

    result[repoStatsMapper[dir]] = {
      General: {
        nodeModulesSize,
        buildDuration,
      },
      ...collectedStats
    };
  }

  return result
}

module.exports = runConfig
