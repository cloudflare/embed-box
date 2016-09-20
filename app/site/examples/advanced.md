```javascript
new EmbedBox({
  name: "Example Plugin",
  embedCode: "<script src='{{PROJECT_URL}}/examples/library.js'></script>",
  targets: {
    weebly: {
      embedCode: "<script src='{{PROJECT_URL}}/examples/weebly-example-library.js'></script>"
    }
  }
})
```
