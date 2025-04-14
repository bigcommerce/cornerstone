const path = require('path')
const logger = require('../util/logger')
const { diffRepoDir, configPath } = require('../constants')

// load stats-config
function loadStatsConfig() {
  let statsConfig

  try {
    statsConfig = require(path.join(
      diffRepoDir,
      configPath,
      'stats-config.js'
    ))
  } catch (_) {
    /* */
  }

  if (!statsConfig) {
    throw new Error(`Failed to locate \`stats-config.js\` by ${configPath}`)
  }

  logger(
    'Got statsConfig at',
    path.join(configPath, 'stats-config.js'),
    '\n',
    statsConfig,
    '\n'
  )
  return statsConfig
}

module.exports = loadStatsConfig
