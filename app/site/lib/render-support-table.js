function targetToRow({supports}) {
  const {embedCode, plugin} = supports
  const yes = "Yes"
  const no = "No"

  return [
    embedCode ? yes : no,
    plugin ? yes : no
  ]
}

export default function renderSupportTable(EmbedBox) {
  const tableBody = document.querySelector("#target-supports tbody")

  EmbedBox.fetchedTargets.forEach(Target => {
    const row = document.createElement("tr")
    const cells = [`<code>${Target.id}</code>`].concat(targetToRow(Target))

    row.innerHTML = cells.reduce((html, cell) => `${html}<td>${cell}</td>`, "")

    tableBody.appendChild(row)
  })
}
