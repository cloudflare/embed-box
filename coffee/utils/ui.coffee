resets = require('./reset')

inlineStyles = (styleObj) ->
  styles = ''
  for prop, value of styleObj
    styles += "#{ prop }:#{ value }!important;"
  styles

removeElement = (element) ->
  element.parentNode?.removeChild element

createIframe = ->
  iframe = document.createElement('iframe')
  iframe.setAttribute 'data-universal-embed-element', true
  iframe.setAttribute 'style', inlineStyles resets.IFRAME
  iframe.setAttribute 'allowTransparency', true
  iframe

createElement = ->
  element = document.createElement('universal-embed')
  element.setAttribute 'data-universal-embed-element', true
  element

executeIncludedScripts = (el, doc = window.document) ->
  scripts = el.querySelectorAll 'script'
  return unless scripts
  for script, j in scripts
    newScript = doc.createElement 'script'

    if scripts[j].attributes.length
      for k in [scripts[j].attributes.length..0]
        attr = scripts[j].attributes[k]
        newScript.setAttribute attr.name, attr.value if attr.specified

    newScript.innerHTML = scripts[j].innerHTML
    el.replaceChild newScript, scripts[j]

module.exports = {inlineStyles, removeElement, createIframe, createElement, executeIncludedScripts}
