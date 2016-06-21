Bus = require('../bower_components/bus/coffee/client')

{EmbedModalView} = require('./views/embedModal')

init = ->

  Array::forEach.call document.querySelectorAll('[data-universal-embed-action="modal-open"]'), (el) ->
    modal = new EmbedModalView
      brandColor: el.getAttribute('data-universal-embed-brand-color')

    el.addEventListener 'click', ->
      modal.open() unless modal.isOpen()

document.addEventListener 'DOMContentLoaded', init
