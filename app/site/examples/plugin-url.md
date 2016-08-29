```javascript
new EmbedBox({
  embedCode: "<script src='{{BASE_URL}}/examples/example-library.js'></script>",
  targets: {
    wordpress: {
      pluginURL: "{{BASE_URL}}/examples/wordpress-plugin.zip"
    },
    drupal: {
      pluginURL: "{{BASE_URL}}/examples/drupal-plugin.zip"
    },
    squarespace: {
      pluginURL: "{{BASE_URL}}/examples/library.zip",
      embedCode: "<script src='//library.js'></script>"
    },
    generic: {
      pluginURL: "{{BASE_URL}}/examples/library.zip",
      embedCode: "<script src='//library.js'></script>"
    }
  }
})
```
