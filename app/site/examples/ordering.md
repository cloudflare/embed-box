```javascript
new EmbedBox({
  embedCode: "<script src='//fast.eager.io/UJbzkz5Kc6.js'></script>",
  targets: {
    wordpress: {
      pluginURL: "https://packager.eager.io/wordpress/v2.0.2/plugin.zip?siteId=UJbzkz5Kc6",
      order: 1
    },
    joomla: {
      pluginURL: "https://packager.eager.io/joomla/v1.0.3/plugin.zip?siteId=UJbzkz5Kc6",
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
