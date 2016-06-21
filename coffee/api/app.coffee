aye = require('ayepromise')

loadApp = (id) ->
  deferred = aye.defer()
  
  url = "https://api.eager.io/apps/#{ id }"
  req = new XMLHttpRequest()
  req.open('GET', url, true)

  req.addEventListener 'load', ->
    try
      deferred.resolve JSON.parse req.response
    catch e
      deferred.reject e

  req.addEventListener 'error', deferred.reject

  req.send()

  deferred.promise

module.exports = {loadApp}
