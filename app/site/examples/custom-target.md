```javascript
var CustomTarget = EmbedBoxCustomTarget.extend({
  id: "custom-test",
  label: "Custom Target",
  templateVars: {
    registerURL: "http://example.com/register"
  },
  template: function(vars) {
    return "" +
    "<ol class='steps'>" +
    "  <li>" +
    "    <p>" +
    "      <a href='" + vars.registerURL + "'>Register an account</a> before installing." +
    "    </p>" +
    "  </li>" +
    "</ol>"
  }
})

new EmbedBoxCustom({
  customTargets: [CustomTarget]
})
```
