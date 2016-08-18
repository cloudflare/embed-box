export default function polyfillCustomEvent({document: $document, window: $window}) {
  let supported = true

  try {
    // IE10 will fail to construct a CustomEvent
    new $window.CustomEvent()
  }
  catch (e) {
    supported = false
  }

  if (supported) return

  function PolyFilledCustomEvent(event, {bubbles = false, cancelable = false, detail} = {}) {
    const shimEvent = $document.createEvent("CustomEvent")

    shimEvent.initCustomEvent(event, bubbles, cancelable, detail)

    return shimEvent
  }

  PolyFilledCustomEvent.prototype = $window.Event.prototype

  $window.PolyFilledCustomEvent = PolyFilledCustomEvent
}
