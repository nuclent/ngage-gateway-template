const fs = require('node:fs')
const curDir = process.cwd()
const src = process.argv[2]

// Filter package.json
const targetFile = `${curDir}/dist/${src}/package.json`
const pkg = require(targetFile)

if (!pkg) {
  process.exit()
}

const sourceFile = require(`${curDir}/package.json`)

fs.writeFileSync(
  targetFile,
  JSON.stringify(
    {
      ...pkg,
      dependencies: Object.keys(pkg.dependencies).reduce(
        (acc, dep) => ({
          ...acc,
          ...(sourceFile.dependencies[dep] ? { [dep]: pkg.dependencies[dep] } : {}),
        }),
        {},
      ),
      overrides: sourceFile.overrides,
      resolutions: sourceFile.resolutions,
    },
    null,
    ' ',
  ),
)
