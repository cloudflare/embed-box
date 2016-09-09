export default function createStylesheetTemplate(definitions) {
  return function stylesheetTemplate(strings, ...values) {
    const merged = strings.slice()
    let offset = 0

    for (let i = 0; i < merged.length; i++) {
      if (i === values.length) break

      offset++
      const value = `${definitions[values[i] || "inherit"]} !important;`

      merged.splice(i + offset, 0, value)
    }

    return merged.join("")
  }
}
