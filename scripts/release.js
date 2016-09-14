/* eslint-env node */

const {spawnSync} = require("child_process")
const {writeFileSync} = require("fs")
const packageConfig = require("../package.json")
const bowerConfig = require("../bower.json")
const resolve = require("path").resolve.bind(null, __dirname)
const {argv} = process
const stringify = object => JSON.stringify(object, null, 2) + "\n"
const version = argv[argv.length - 1]
const spawnOptions = {
  cwd: resolve(".."),
  encoding: "utf8",
  env: process.env,
  stdio: [0, 1, 2]
}

packageConfig.version = version
bowerConfig.version = version

console.log(`Publishing version ${version}`)
writeFileSync(resolve("../package.json"), stringify(packageConfig))
writeFileSync(resolve("../bower.json"), stringify(bowerConfig))

const tasks = [
  ["npm", ["run", "prepare-publish"]],
  ["git", ["add", "./dist/", "./package.json", "./bower.json"]],
  ["git", ["commit", `-m v${version}`]],
  ["git", ["tag", `v${version}`]]
]

tasks.forEach(task => {
  const {status, error} = spawnSync(...task, spawnOptions)

  if (status !== 0) process.exit(status)
  if (error) throw error
})

console.log("Done!")
console.log("Publish with:")
console.log("git push && git push --tags && npm publish")
