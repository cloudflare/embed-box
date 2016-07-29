import keyMap from "lib/key-map"
import smoothScroll from "smooth-scroll"
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

sequence.push({eventType: "scroll"})


export function runDemo({contentWindow}, onComplete = () => {}) {
  function createEmbedBox() {
    return new contentWindow.EmbedBox({
      downloadURLs: {
        wordpress: "about:blank",
        joomla: "about:blank",
        drupal: "about:blank",
        generic: "about:blank"
      }
    })
  }

  let running = true
  let embedBox = createEmbedBox()

  const iframeDocument = embedBox.iframe.document

  function cancelDemo() {
    if (!running) return

    running = false
    embedBox.destroy()

    embedBox = createEmbedBox()
  }

  iframeDocument.addEventListener("mouseover", cancelDemo)
  iframeDocument.addEventListener("click", cancelDemo)
  iframeDocument.addEventListener("touchend", cancelDemo)

  const searchComponent = iframeDocument.querySelector("[data-component='site-type-search']")
  const input = searchComponent.querySelector(".search")

  function simulate(index = 0) {
    if (!running) return
    if (["hiding", "hidden"].includes(embedBox.visibility)) return

    const {entity, eventType} = sequence[index]
    const meta = {}
    const lastIndex = sequence.length - 1
    let delay = 150

    function onStep() {
      if (index < lastIndex) {
        index++

        simulate(index)
        return
      }

      setTimeout(onComplete, 2000)
    }

    let runStep = () => {
      searchComponent.dispatchEvent(new CustomEvent(`dispatched-${eventType}`, meta))
      onStep()
    }

    if (entity === keyMap.backspace) {
      input.value = ""
    }
    else if (["keypress", "keydown"].includes(eventType)) {
      meta.detail = {keyCode: entity}
      delay = 200
    }
    else if (eventType === "scroll") {
      const container = iframeDocument.querySelector("[data-component='page-wrapper'] .instructions")
      const bottom = container.scrollHeight - container.getBoundingClientRect().height

      runStep = () => smoothScroll(container, bottom, {duration: 3000, onScrolled: onStep})
    }
    else {
      const next = sequence[index + 1]

      input.value += entity

      if (next && next.entity === keyMap.backspace) delay = 1100
    }

    setTimeout(runStep, delay)
  }

  setTimeout(simulate, 1000)
}
