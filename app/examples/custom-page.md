```javascript
const CustomPage = EmbedBoxCustomPage.extend({
  id: "custom-test",
  label: "Custom Page",
  templateVars: {
    registerURL: "http://example.com/register"
  },
  template: function(vars) {
    return ""
    + "<section>"
    +   "<h1>Installing " + vars.config.name + "</h1>"
    +   "<p>"
    +     "<a href='${vars.registerURL}'>Register an account</a>"
    +     " before installing."
    +   "</p>"
    + "</section>"
  }
})

new EmbedBoxCustom({
  name: "Custom Page Example",
  pages: [CustomPage]
})
```
