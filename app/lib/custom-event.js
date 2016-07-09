export default function polyfillCustomEvent({document, window}) {
  if (typeof window.CustomEvent === "function") return false

  function CustomEvent (event, params = {bubbles: false, cancelable: false}) {
    const shimEvent = document.createEvent("CustomEvent")

    shimEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)

    return shimEvent
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
}
