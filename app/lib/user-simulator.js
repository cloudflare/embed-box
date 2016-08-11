import keyMap from "lib/key-map"
import smoothScroll from "smooth-scroll"
const TARGET_ENTRIES = [
  "WordPress",
  "Drupal",
  "Joomla",
  "Any site"
]

let sequence = []
let embedBox

const toKeyDown = () => ({entity: keyMap.down, eventType: "keydown"})

TARGET_ENTRIES.forEach(phrase => {
  const subSet = [...phrase, keyMap.backspace]

  sequence = sequence.concat(subSet.map(entity => ({entity, eventType: "input"})))
})

sequence = sequence.concat(
  TARGET_ENTRIES.map(toKeyDown),
  {entity: keyMap.enter, eventType: "keypress"}
)

sequence.push({eventType: "scroll"})

export function runDemo(iframe, onComplete = () => {}) {
  let completionTimeout
  let stepTimeout
  const {EmbedBox} = iframe.contentWindow
  const DEFAULTS = {
    embedCode: "<script src='http://example.com/plugin.js'></script>",
    downloadURL: "about:blank",
    routing: false
  }
  const barrier = iframe.parentNode.querySelector(".barrier")
  const loadingDots = iframe.parentNode.querySelector(".loading-dots")
  let running = true

  function createInteractiveDemo() {
    clearTimeout(stepTimeout)
    clearTimeout(completionTimeout)
    running = false

    barrier.style.display = "none"

    if (embedBox) embedBox.destroy()

    const config = {...DEFAULTS,
      events: {
        visibilityChange(visibility) {
          if (visibility === "shown") {
            loadingDots.setAttribute("data-state", "loaded")
          }

          if (visibility === "hidden") {
            loadingDots.setAttribute("data-state", "loading")
            setTimeout(createInteractiveDemo, 2500)
          }
        }
      }
    }

    loadingDots.setAttribute("data-state", "loading")
    requestAnimationFrame(() => embedBox = new EmbedBox(config))
  }

  if (embedBox) embedBox.destroy()
  embedBox = new EmbedBox(DEFAULTS)
  loadingDots.setAttribute("data-state", "loaded")

  barrier.addEventListener("click", createInteractiveDemo)

  const iframeDocument = embedBox.iframe.document
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

      completionTimeout = setTimeout(onComplete, 2000)
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
      const container = iframeDocument.querySelector("[data-component='target-wrapper'] .instructions")
      const bottom = container.scrollHeight - container.getBoundingClientRect().height

      runStep = () => smoothScroll(container, bottom, {duration: 3000, onScrolled: onStep})
    }
    else {
      const next = sequence[index + 1]

      input.value += entity

      if (next && next.entity === keyMap.backspace) delay = 1100
    }

    stepTimeout = setTimeout(runStep, delay)
  }

  setTimeout(simulate, 1000)

  return createInteractiveDemo
}
