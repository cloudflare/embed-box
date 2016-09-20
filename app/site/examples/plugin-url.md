```javascript
new EmbedBox({
  embedCode: "<script src='{{PROJECT_URL}}/examples/example-library.js'></script>",
  targets: {
    wordpress: {
      pluginURL: "{{PROJECT_URL}}/examples/wordpress-plugin.zip"
    },
    drupal: {
      pluginURL: "{{PROJECT_URL}}/examples/drupal-plugin.zip"
    },
    joomla: {
      pluginURL: "{{PROJECT_URL}}/examples/joomla-plugin.zip"
    }
  }
})
```
