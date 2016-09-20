```javascript
new EmbedBox({
  name: "Example Plugin",
  embedCode: "" +
  "<script src='{{PROJECT_URL}}/examples/library.js'></script>\n" +
  "<script>\n" +
  "  (function(){\n" +
  "    var options = { /*  ... */ };\n" +
  "    Library.init(options);\n" +
  "  })();\n" +
  "</script>"
})
```
