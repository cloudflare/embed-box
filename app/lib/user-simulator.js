import keyMap from "lib/key-map"

const PAGE_ENTRIES = [
  "WordPress",
  "Drupal",
  "Joomla",
  "Any site"
]

let sequence = []

const toKeyDown = () => ({entity: keyMap.down, eventType: "keydown"})

PAGE_ENTRIES.forEach(phrase => {
  const subSet = [...phrase, keyMap.backspace]

  sequence = sequence.concat(subSet.map(entity => ({entity, eventType: "input"})))
})

sequence = sequence.concat(
  PAGE_ENTRIES.map(toKeyDown),
  {entity: keyMap.enter, eventType: "keypress"}
)

export function runDemo({contentWindow}) {
  const embedBox = new contentWindow.EmbedBox()
  const iframeDocument = embedBox.iframe.document

  const searchComponent = iframeDocument.querySelector("[data-component='site-type-search']")
  const input = searchComponent.querySelector(".search")

  function simulate(index) {
    const {entity, eventType} = sequence[index]
    const meta = {}
    let delay = 150

    if (entity === keyMap.backspace) {
      input.value = ""
    }
    else if (["keypress", "keydown"].includes(eventType)) {
      meta.detail = {keyCode: entity}
      delay = 200
    }
    else {
      const next = sequence[index + 1]

      input.value += entity

      if (next && next.entity === keyMap.backspace) delay = 1100
    }

    searchComponent.dispatchEvent(new CustomEvent(`dispatched-${eventType}`, meta))

    if (index < sequence.length - 1) {
      index++

      setTimeout(simulate.bind(null, index), delay)
    }
  }

  simulate(0)
}
