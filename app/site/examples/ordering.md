```javascript
new EmbedBox({
  embedCode: "<script src='{{BASE_URL}}/examples/library.js'></script>",
  targets: {
    wordpress: {
      order: 1
    },
    drupal: {
      order: 2
    },
    weebly: {
      order: 3
    },
    joomla: {
      order: -1
    }
  }
})
```
