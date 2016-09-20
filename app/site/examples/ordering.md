```javascript
new EmbedBox({
  embedCode: "<script src='{{PROJECT_URL}}/examples/library.js'></script>",
  targets: {
    wordpress: {
      priority: 1
    },
    drupal: {
      priority: 2
    },
    weebly: {
      priority: 3
    },
    joomla: {
      priority: -1
    }
  }
})
```
