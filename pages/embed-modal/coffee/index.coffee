updateAppName = ->
  name = document.location.hash.substring(1)

  wordpress = false
  if name.indexOf('wp!') is 0
    name = name.substring(3)

    wordpress = true

  if wordpress
    hide = document.querySelectorAll('.only-in-page')
  else
    hide = document.querySelectorAll('.only-in-wordpress')

  if hide
    for el in hide
      el.style.display = 'none'

  if name
    cta = "Back to installing #{ name }"
  else
    cta = "Let’s install an app!"

  document.querySelector('.install-cta').textContent = cta

  document.body.style.display = 'block'

document.addEventListener 'DOMContentLoaded', ->
  document.querySelector('.install-cta').addEventListener 'click', (event) ->
    event.preventDefault()

    window.parent.postMessage 'eager-welcome-dialog:ok:click', '*'

  document.querySelector('.cancel-button').addEventListener 'click', (event) ->
    event.preventDefault()

    window.parent.postMessage 'eager-welcome-dialog:cancel:click', '*'

  updateAppName()
  window.addEventListener 'hashchange', updateAppName
