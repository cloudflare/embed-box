```javascript
new EmbedBox({
  name: "Acme plugin",
  embedCode: "<script src='{{PROJECT_URL}}/examples/library.js'></script>",
  labels: {
    title: function(config) { return config.name + " install guide" },
    searchHeader: "Press or enter the type of website you have.",
    searchPlaceholder: "Filter..."
  }
})
```
