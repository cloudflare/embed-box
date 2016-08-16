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
    generic: {
      downloadURL: "{{BASE_URL}}/examples/library.js",
      embedCode: "<script src='//library.js'></script>"
    }
  }
})
```