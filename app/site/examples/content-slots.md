```javascript
new EmbedBox({
  name: "FooBar",
  embedCode: "<script src='{{BASE_URL}}/examples/library.js'></script>",
  beforeContent: "Having some trouble? " +
    "Call us at <strong>(555)-123-4567</strong>",
  afterContent: "You should receive an email with your account password.",
  targets: {
    wordpress: {
      beforeContent: "FooBar works best with WordPress 4.0 or higher."
    }
  }
})
```
