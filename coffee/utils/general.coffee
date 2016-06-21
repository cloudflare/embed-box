extend = (out={}, others...) ->
  for obj in others when obj
    for k, v of obj when obj.hasOwnProperty(k)
      out[k] = v

  out

each = (arrayOrNodeList, callback) ->
  Array.prototype.forEach.call arrayOrNodeList, callback

module.exports = {extend, each}
