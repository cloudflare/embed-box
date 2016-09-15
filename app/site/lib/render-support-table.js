const booleanToLabel = boolean => ({
  label: boolean ? "✓" : "✗",
  supported: !!boolean
})

function targetToRow({supports}) {
  const {embedCode, plugin, insertInto = {}} = supports

  return [
    embedCode,
    plugin,
    insertInto.head,
    insertInto.body
  ].map(booleanToLabel)
}

function rowTemplate(html, {label, supported = ""}) {
  return `${html}<td data-supported="${supported}">${label}</td>`
}

export default function renderSupportTable(EmbedBox) {
  const tableBody = document.querySelector("#target-supports tbody")

  EmbedBox.fetchedTargets.forEach(Target => {
    const row = document.createElement("tr")
    const cells = [{label: `<code>${Target.id}</code>`}].concat(targetToRow(Target))

    row.innerHTML = cells.reduce(rowTemplate, "")

    tableBody.appendChild(row)
  })
}
