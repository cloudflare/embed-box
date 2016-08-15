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
    +   this.renderTitle()
    +   this.renderBeforeContent()
    +   "<ol class='steps'>"
    +     "<li>"
    +       "<a href='${vars.registerURL}'>Register an account</a> before installing."
    +     "</li>"
    +   "</ol>"
    +   this.renderAfterContent()
    + "</section>"
  }
})

new EmbedBoxCustom({
  customTargets: [CustomTarget]
})
```
