```javascript
var CustomTarget = EmbedBoxCustomTarget.extend({
  id: "custom-test",
  label: "Custom Target",
  templateVars: {
    registerURL: "http://example.com/register"
  },
  template: function(vars) {
    return ""
    + "<section>"
    +   "<header class='target-title' data-column>"
    +     "<h1>Installing " + vars.config.name + "</h1>"
    +   "</header>"
    +   "<p>"
    +     "<a href='${vars.registerURL}'>Register an account</a>"
    +     " before installing."
    +   "</p>"
    + "</section>"
  }
})

new EmbedBoxCustom({
  name: "Custom Target Example",
  customTargets: [CustomTarget]
})
```
