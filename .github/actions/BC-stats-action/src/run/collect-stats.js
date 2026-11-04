const path = require('path')
const fs = require('fs-extra')
const glob = require('../util/glob')
const gzipSize = require('gzip-size')
const logger = require('../util/logger')

module.exports = async function collectStats(statsConfig = {}, curDir) {
  let stats = {}

  for (const fileGroup of statsConfig.filesToTrack) {
    const { name, globs } = fileGroup
    const groupStats = {}
    const curFiles = new Set()

    for (const pattern of globs) {
        const results = await glob(pattern, { cwd: curDir, nodir: true })
        results.forEach((result) => curFiles.add(result))
    }

    for (const file of curFiles) {
        const fileKey = path.basename(file)
        const absPath = path.join(curDir, file)
        try {
            const fileInfo = await fs.stat(absPath)
            groupStats[fileKey] = fileInfo.size
            groupStats[`${fileKey} gzip`] = await gzipSize.file(absPath)
        } catch (err) {
            logger.error('Failed to get file stats', err)
        }
    }

    stats[name] = groupStats
  }

  return stats
}
