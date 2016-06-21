document.querySelector('a.close').addEventListener 'click', (event) ->
  event.preventDefault()

  window.parent.postMessage 'embed-modal:cancel:click', '*'
