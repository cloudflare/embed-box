```javascript
new EmbedBox({
  name: "Example Download Plugin",
  insertInHead: true,
  downloadURL: "http://example.com/plugin.js",
  targets: {
    wordpress: {
      downloadURL: "http://example.com/wordpress-plugin.zip"
    }
  }
})
```
