```javascript
var embedBox = new EmbedBox({
  autoShow: false,
  embedCode: "<script src='{{PROJECT_URL}}/examples/library.js'></script>"
})

embedBox.show()

setTimeout(function () {
  embedBox.destroy()
}, 5000)
```
