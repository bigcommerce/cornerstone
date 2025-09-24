const exec = require('../util/exec')
const { remove } = require('fs-extra')
const logger = require('../util/logger')
const semver = require('semver')

module.exports = (actionInfo) => {
  return {
    async cloneRepo(repoPath = '', dest = '') {
      await remove(dest)
      await exec(`git clone ${actionInfo.gitRoot}${repoPath} ${dest}`)
    },
    async checkoutRef(ref = '', repoDir = '') {
      await exec(`cd ${repoDir} && git fetch && git checkout ${ref}`)
    },
    async getLastStable(repoDir = '', ref) {
      const { stdout } = await exec(`cd ${repoDir} && git tag -l`)
      const tags = stdout.trim().split('\n')
      let lastStableTag

      for (let i = tags.length - 1; i >= 0; i--) {
        const curTag = tags[i]
        // stable doesn't include `-canary` or `-beta`
        if (!curTag.includes('-') && !ref.includes(curTag)) {
          if (!lastStableTag || semver.gt(curTag, lastStableTag)) {
            lastStableTag = curTag
          }
        }
      }
      return lastStableTag
    },
    async getCommitId(repoDir = '') {
      const { stdout } = await exec(`cd ${repoDir} && git rev-parse HEAD`)
      return stdout.trim()
    },
    async resetToRef(ref = '', repoDir = '') {
      await exec(`cd ${repoDir} && git reset --hard ${ref}`)
    },
    async mergeBranch(ref = '', origRepoDir = '', destRepoDir = '') {
      await exec(`cd ${destRepoDir} && git remote add upstream ${origRepoDir}`)
      await exec(`cd ${destRepoDir} && git fetch upstream`)

      try {
        await exec(`cd ${destRepoDir} && git merge upstream/${ref}`)
        logger('Auto merge of main branch successful')
      } catch (err) {
        logger.error('Failed to auto merge main branch:', err)

        if (err.stdout && err.stdout.includes('CONFLICT')) {
          await exec(`cd ${destRepoDir} && git merge --abort`)
          logger('aborted auto merge')
        }
      }
    }
  }
}
