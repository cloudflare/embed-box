```javascript
var embedBox = new EmbedBox({
  autoShow: false,
  embedCode: "<script src='{{BASE_URL}}/examples/library.js'></script>"
})

embedBox.show()

setTimeout(function () {
  embedBox.hide()
  embedBox.destroy()
}, 5000)
```
