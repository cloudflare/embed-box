```javascript
const CustomPage = EmbedBoxCustomPage.extend({
  id: "custom-test",
  label: "Custom Page",
  templateVars: {
    registerURL: "http://example.com/register"
  },
  template: vars => `<section>
    <h1>Installing ${vars.config.name}</h1>

    <p>
      <a href="${vars.registerURL}">
        Register anaccount
      </a>
      before installing.
    </p>
  </section>`
})

new EmbedBoxCustom({
  name: "Custom Page Example",
  pages: [CustomPage]
})
```
