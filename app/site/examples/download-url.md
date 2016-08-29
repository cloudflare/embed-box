```javascript
new EmbedBox({
  embedCode: "<script src='{{BASE_URL}}/examples/example-library.js'></script>",
  targets: {
    wordpress: {
      downloadURL: "{{BASE_URL}}/examples/wordpress-plugin.zip"
    },
    drupal: {
      downloadURL: "{{BASE_URL}}/examples/drupal-plugin.zip"
    },
    squarespace: {
      downloadURL: "{{BASE_URL}}/examples/library.zip",
      embedCode: "<script src='//library.js'></script>"
    },
    generic: {
      downloadURL: "{{BASE_URL}}/examples/library.zip",
      embedCode: "<script src='//library.js'></script>"
    }
  }
})
```
