```javascript
const CustomPage = UniversalEmbedCustomPage.extend({
  id: "custom-test",
  label: "Custom Page",
  templateVars: {
    registerURL: "http://example.com/register"
  },
  template: vars => `<section>
    <h1>Installing ${vars.config.appName}</h1>

    <p>
      <a href="${vars.registerURL}">Register an account</a> before installing.
    </p>
  </section>`
})

const universalEmbed = new UniversalEmbedCustom({
  appName: "Custom Page Example",
  pages: [CustomPage]
})

universalEmbed.show()
```
