export default function loadScripts(scriptPaths, document, onComplete = () => {}) {
  let {length} = scriptPaths

  function onload() {
    length--
    if (length === 0) onComplete()
  }

  scriptPaths.forEach(src => {
    const script = document.createElement("script")

    Object.assign(script, {src, onload})
    document.head.appendChild(script)
  })
}
