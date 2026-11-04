const path = require('path')
const fs = require('fs').promises
const fetch = require('node-fetch')
const prettyMs = require('pretty-ms')
const logger = require('./util/logger')
const prettyBytes = require('pretty-bytes')

const gzipIgnoreRegex = new RegExp(`General`)

const prettify = (val, type = 'bytes') => {
  if (typeof val !== 'number') return 'N/A'
  return type === 'bytes' ? prettyBytes(val) : prettyMs(val)
}

const round = (num, places) => {
  const placesFactor = Math.pow(10, places)
  return Math.round(num * placesFactor) / placesFactor
}

const shortenLabel = (itemKey) =>
  itemKey.length > 24
    ? `${itemKey.substr(0, 12)}..${itemKey.substr(itemKey.length - 12, 12)}`
    : itemKey

const twoMB = 2 * 1024 * 1024

module.exports = async function addComment(result = {}, actionInfo, statsConfig) {
  let comment = `# 'Stats from current PR\n\n`

  const tableHead = `|  | ${statsConfig.mainRepo} ${statsConfig.mainBranch} ${
    actionInfo.lastStableTag || ''
  } | ${actionInfo.prRepo} ${actionInfo.prRef} | Change |\n| - | - | - | - |\n`

  let resultHasIncrease = false
  let resultHasDecrease = false
  let resultContent = ''

  Object.keys(result.mainRepoStats).forEach((groupKey) => {
    const mainRepoGroup = result.mainRepoStats[groupKey]
    const diffRepoGroup = result.diffRepoStats[groupKey]
    const itemKeys = new Set([
      ...Object.keys(mainRepoGroup),
      ...Object.keys(diffRepoGroup),
    ])
    let groupTable = tableHead
    let mainRepoTotal = 0
    let diffRepoTotal = 0
    let totalChange = 0

    itemKeys.forEach((itemKey) => {
      const prettyType = itemKey.match(/(length|duration)/i) ? 'ms' : 'bytes'
      const isGzipItem = itemKey.endsWith('gzip')
      const mainItemVal = mainRepoGroup[itemKey]
      const diffItemVal = diffRepoGroup[itemKey]
      const useRawValue = prettyType !== 'ms'
      const mainItemStr = useRawValue
        ? mainItemVal
        : prettify(mainItemVal, prettyType)

      const diffItemStr = useRawValue
        ? diffItemVal
        : prettify(diffItemVal, prettyType)

      let change = '✓'

      if (!isGzipItem && !groupKey.match(gzipIgnoreRegex)) return

      if (itemKey !== 'buildDuration' || (itemKey.match(/req\/sec/))) {
        if (typeof mainItemVal === 'number') mainRepoTotal += mainItemVal
        if (typeof diffItemVal === 'number') diffRepoTotal += diffItemVal
      }

      // calculate the change
      if (mainItemVal !== diffItemVal) {
        if (typeof mainItemVal === 'number' && typeof diffItemVal === 'number') {
          change = round(diffItemVal - mainItemVal, 2)

          // check if there is still a change after rounding
          if (change !== 0) {
            const absChange = Math.abs(change)
            const warnIfNegative = itemKey.match(/req\/sec/)
            const warn = warnIfNegative
              ? change < 0
                ? '⚠️ '
                : ''
              : change > 0
              ? '⚠️ '
              : ''
            change = `${warn}${change < 0 ? '-' : '+'}${
              useRawValue ? absChange : prettify(absChange, prettyType)
            }`
          }
        } else {
          change = 'N/A'
        }
      }

      groupTable += `| ${shortenLabel(itemKey)} | ${mainItemStr} | ${diffItemStr} | ${change} |\n`
    })
    let groupTotalChange = ''

    totalChange = diffRepoTotal - mainRepoTotal

    if (totalChange !== 0) {
      if (totalChange < 0) {
        resultHasDecrease = true
        groupTotalChange = ` Overall decrease '✓'}`
      } else {
        if ((groupKey !== 'General' && totalChange > 5) || totalChange > twoMB) {
          resultHasIncrease = true
        }
        groupTotalChange = ` Overall increase '⚠️'}`
      }
    }

    if (groupKey !== 'General') {
      let totalChangeSign = ''

      if (totalChange === 0) {
        totalChange = '✓'
      } else {
        totalChangeSign = totalChange < 0 ? '-' : '⚠️ +'
      }
      totalChange = `${totalChangeSign}${
        typeof totalChange === 'number' ? prettify(Math.abs(totalChange)) : totalChange
      }`
      groupTable += `| Overall change | ${prettyBytes(
        round(mainRepoTotal, 2)
      )} | ${prettyBytes(round(diffRepoTotal, 2))} | ${totalChange} |\n`
    }

    if (itemKeys.size > 0) {
      resultContent += `<details>\n`
      resultContent += `<summary><strong>${groupKey}</strong>${groupTotalChange}</summary>\n\n`
      resultContent += groupTable
      resultContent += `\n</details>\n\n`
    }
  })

  let increaseDecreaseNote = ''

  if (resultHasIncrease) {
    increaseDecreaseNote = ' (Increase detected ⚠️)'
  } else if (resultHasDecrease) {
    increaseDecreaseNote = ' (Decrease detected ✓)'
  }

  comment += `<details>\n`
  comment += `<summary>${increaseDecreaseNote}</summary>\n\n<br/>\n\n`
  comment += resultContent
  comment += '</details>\n'

  if (process.env.LOCAL_STATS) {
    const statsPath = path.resolve('pr-stats.md')
    await fs.writeFile(statsPath, comment)
    console.log(`Output PR stats to ${statsPath}`)
  } else {
    logger('\n--stats start--\n', comment, '\n--stats end--\n')
  }

  if (actionInfo.githubToken && actionInfo.commentEndpoint) {
    logger(`Posting results to ${actionInfo.commentEndpoint}`)

    const body = {
      body: comment,
      commitId: actionInfo.commitId,
      issueId: actionInfo.issueId,
    }

    try {
      const res = await fetch(actionInfo.commentEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${actionInfo.githubToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        logger.error(`Failed to post results ${res.status}`)
        try {
          logger.error(await res.text())
        } catch (_) {
          /* no-op */
        }
      } else {
        logger('Successfully posted results')
      }
    } catch (err) {
      logger.error(`Error occurred posting results`, err)
    }
  } else {
    logger(
      `Not posting results`,
      actionInfo.githubToken ? 'No comment endpoint' : 'no GitHub token'
    )
  }
}
