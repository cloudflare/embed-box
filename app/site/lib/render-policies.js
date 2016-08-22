// global embed, local embed, download URL
const POLICY_CELLS = {
  DOWNLOAD: ["No", "No", "Yes"],
  EMBED: ["Yes", "Yes", "No"],
  NAND: ["Yes", "Yes", "Yes"],
  OR: ["Yes", "Yes", "Without local <code>embedCode</code>"]
}

export default function renderPolicies(EmbedBox) {
  const tableBody = document.querySelector("#target-policies tbody")

  EmbedBox.fetchedTargets.forEach(Target => {
    const row = document.createElement("tr")
    const cells = [`<code>${Target.id}</code>`].concat(POLICY_CELLS[Target.policy])

    row.innerHTML = cells.reduce((html, cell) => `${html}<td>${cell}</td>`, "")

    tableBody.appendChild(row)
  })
}
