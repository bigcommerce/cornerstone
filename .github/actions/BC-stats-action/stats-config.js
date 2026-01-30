const StatsConfig = {
    // the Heading to show at the top of stats comments
    commentHeading: 'Stats from current PR',
    commentReleaseHeading: 'Stats from current release',
    // the command to build your project if not done on post install
    initialBuildCommand: 'npm install',
    skipInitialInstall: true,
    // the command to build the app (app source should be in `.stats-app`)
    appBuildCommand: 'npm run build',
    // the main branch to compare against (what PRs will be merging into)
    mainBranch: 'master',
    // the main repository path (relative to https://github.com/)
    mainRepo: 'bigcommerce/cornerstone',
    // an array of file groups to diff/track
    filesToTrack: [
        {
            name: 'Client bundles',
            globs: ['assets/dist/**/*.js']
        }
    ],
}

module.exports = StatsConfig
