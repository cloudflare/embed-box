function logError(error) {
  console.dir(error, {depth: null, colors: true})
}

module.exports = function validate(fatalError, stats) {
  if (fatalError) throw fatalError

  const {errors, warnings} = stats.toJson()

  if (errors.length > 0 || warnings.length > 0) {
    logError(warnings)
    logError(errors)
    process.exit(1)
  }
}
