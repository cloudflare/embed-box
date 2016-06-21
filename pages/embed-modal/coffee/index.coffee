document.querySelector('a.close').addEventListener 'click', (event) ->
  event.preventDefault()

  window.parent.postMessage 'embed-modal:cancel:click', '*'

document.querySelector('a.button.primary.more').addEventListener 'click', (event) ->
  document.querySelector('.modal-body-page[data-modal-page="1"]').classList.add 'hidden'
  document.querySelector('.modal-body-page[data-modal-page="2"]').classList.remove 'hidden'
  document.querySelector('.back').classList.remove 'hidden'
