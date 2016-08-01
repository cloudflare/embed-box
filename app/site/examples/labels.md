```javascript
new EmbedBox({
  name: "Acme plugin",
  labels: {
    title: function(config) { return `${config.name} install guide` },
    searchPlaceholder: "Press or enter the type of website you have.",
    next: "Continue",
    done: "Finished"
  }
})
```
