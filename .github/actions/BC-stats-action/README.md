## Stats Config

```TypeScript
const StatsConfig = {
  // the Heading to show at the top of stats comments
  commentHeading: 'Stats from current PR' | undefined,
  commentReleaseHeading: 'Stats from current release' | undefined,
  // the command to build your project if not done on post install
  initialBuildCommand: undefined | string,
  skipInitialInstall: undefined | boolean,
  // the command to build the app (app source should be in `.stats-app`)
  appBuildCommand: string,
  appStartCommand: string | undefined,
  // the main branch to compare against (what PRs will be merging into)
  mainBranch: 'canary',
  // the main repository path (relative to https://github.com/)
  mainRepo: 'vercel/next.js',
  // whether to attempt auto merging the main branch into PR before running stats
  autoMergeMain: boolean | undefined,
  // whether to diff the outputted files (default: onOutputChange)
  diff: 'onOutputChange' | false | undefined,
  // an array of file groups to diff/track
  filesToTrack: [
      {
          name: 'Pages',
          globs: [
              'build/pages/**/*.js'
          ]
      }
  ],
  // an array of URLs to fetch while `appStartCommand` is running
  // will be output to fetched-pages/${pathname}.html
  pagesToFetch: [
      'https://localhost:$PORT/page-1'
  ]
}

module.exports = StatsConfig
```
