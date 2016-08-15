import keyMap from "lib/key-map"
import smoothScroll from "smooth-scroll"

function createSequence(EmbedBox) {
  const targetLabels = EmbedBox.fetchedTargets.map(Target => Target.label)

  let sequence = []

  const toKeyDown = () => ({entity: keyMap.down, eventType: "keydown"})

  targetLabels.forEach(phrase => {
    const subSet = [...phrase, keyMap.backspace]

    sequence = sequence.concat(subSet.map(entity => ({entity, eventType: "input"})))
  })

  sequence = sequence.concat(
    targetLabels.map(toKeyDown),
    {entity: keyMap.enter, eventType: "keypress"}
  )

  sequence.push({eventType: "scroll"})

  return sequence
}

let instance
let completionTimeout
let stepTimeout
let createInteractiveDemo

export function runDemo(iframe, onComplete = () => {}) {
  // Automated and user events may be subjected to race conditions between runs.
  clearTimeout(stepTimeout)
  clearTimeout(completionTimeout)

  const {EmbedBox} = iframe.contentWindow
  const sequence = createSequence(EmbedBox)
  const defaults = {
    embedCode: `<script src='${BASE_URL}/examples/generic-library.js'></script>`,
    routing: false
  }
  const barrier = iframe.parentNode.querySelector(".barrier")
  const loadingDots = iframe.parentNode.querySelector(".loading-dots")
  let running = true

  if (createInteractiveDemo) barrier.removeEventListener("click", createInteractiveDemo)

  createInteractiveDemo = () => {
    clearTimeout(stepTimeout)
    clearTimeout(completionTimeout)
    running = false

    barrier.style.display = "none"

    if (instance) instance.destroy()

    const config = {...defaults,
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
    requestAnimationFrame(() => instance = new EmbedBox(config))
  }

  if (instance) instance.destroy()
  instance = new EmbedBox(defaults)
  loadingDots.setAttribute("data-state", "loaded")

  barrier.addEventListener("click", createInteractiveDemo)

  const iframeDocument = instance.iframe.document
  const searchComponent = iframeDocument.querySelector("[data-component='target-search']")
  const input = searchComponent.querySelector(".search")

  // Prevent input events from scrolling Firefox.
  input.readOnly = true

  function simulate(index = 0) {
    if (!running) return
    if (["hiding", "hidden"].includes(instance.visibility)) return

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
