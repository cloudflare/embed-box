ui = require('../utils/ui')
resets = require('../utils/reset')
{extend} = require('../utils/general')
{Evented} = require('../utils/events')

class EmbedModalView extends Evented
  constructor: (@options={}) ->
    @_isOpen = false
    @template = __UNIVERSAL_EMBED_TEMPLATES['../pages/embed-modal/index.html']

  open: ->
    @el = ui.createIframe()

    document.body.appendChild @el

    @document = @el.contentWindow.document
    @document.body.innerHTML = """
      #{ @template }
      <style>
        a, .brand-color {
          color: #{ @options.brandColor }
        }

        .button.primary, .brand-background-color {
          background-color: #{ @options.brandColor }
        }
      </style>
    """

    window.addEventListener 'message', (messageEvent) =>
      if messageEvent.data is 'embed-modal:cancel:click'
        @close()

    ui.executeIncludedScripts @document.body, @document

    @el.setAttribute('style', ui.inlineStyles(extend {}, resets.IFRAME,
      width: '100%'
      height: '100%'
    ))

    @_isOpen = true

  close: ->
    ui.removeElement @el
    @_isOpen = false

  isOpen: ->
    return @_isOpen

module.exports = {EmbedModalView}
