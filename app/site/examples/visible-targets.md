```javascript
new EmbedBox({
  embedCode: "<script src='http://example.com/library.js</script>",
  targets: {
    wordpress: {
      downloadURL: "http://example.com/wordpress-plugin.zip",
      order: 1
    },
    joomla: {
      downloadURL: "http://example.com/joomla-plugin.zip",
      order: 2
    },
    weebly: {
      order: 3
    },
    generic: {
      order: -1
    }
  }
})
```
