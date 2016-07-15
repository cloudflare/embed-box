# Universal Embed

Give your users a way to embed your plugin onto any type of website.

## Installation

The universal embed supports the latest Chrome, Safari Firefox, and IE9+

### Standalone

Download and include with a script tag.
`UniversalEmbed` will be registered as a global variable.

```html
<head>
  <script src="universal-embed.js"></script>
</head>

<body>
  <script>
    const universalEmbed = new UniversalEmbed()

    universalEmbed.show()
  </script>
</body>
```

### NPM

NPM is the recommended install method when your application uses a build process.

```shell
$ npm install --save universal-embed
```

```javascript
import UniversalEmbed from "universal-embed"

const universalEmbed = new UniversalEmbed()

universalEmbed.show()
```

### Customization

#### Content

Page content can be customized by adding content in slots.

```javascript
import UniversalEmbed from "universal-embed"

UniversalEmbed.beforeContent = "Contact <strong>ACME Inc.</strong> for an account ID."
UniversalEmbed.afterContent = "Thanks you for installing ACME Inc. embed!"

const universalEmbed = new UniversalEmbed()

universalEmbed.show()
```

Slot content can be limited to single pages as well.

```javascript
const wordPressPage = UniversalEmbed.getPage("wordpress")

wordPressPage.beforeContent = "ACME recommends WordPress <strong>4.5</strong> or higher"
```

#### Custom Pages

```javascript
import UniversalEmbed from "universal-embed"
import CustomPage from "universal-embed/custom-page"

const CustomPage = UniversalEmbedCustomPage.extend({
  id: "custom-test",
  label: "Custom Page",
  template: "<section>Hello from a custom page!</section>"
})

UniversalEmbed.pages.push(CustomPage)

const universalEmbed = new UniversalEmbed()

universalEmbed.show()
```

Templates can be passed as function as well to pass varibles.
The UniversalEmbed configuration is available under `vars.config`.

```javascript
const CustomPage = UniversalEmbedCustomPage.extend({
  id: "custom-test",
  label: "Custom Page",
  templateVars: {
    registerURL: "http://example.com/register"
  },
  template: vars => `<section>
    <h1>Installing ${vars.config.appName} from a custom page</h1>

    <p>
      <a href="${vars.registerURL}">Register an account</a> before installing.
    </p>
  </section>`
})
```

#### Custom Bundles

A custom bundle can be made to include specific pages.

##### Standalone

```html
<head>
  <script src="universal-embed-custom.js"></script>
  <script src="universal-embed-page-wordpress.js"></script>
  <script src="universal-embed-page-joomla.js"></script>
</head>

<body>
  <script>
    console.log(UniversalEmbed.pages) // [WordPressPage, JoomlaPage]

    const universalEmbed = new UniversalEmbed()

    universalEmbed.show()
  </script>
</body>
```

##### With builder

```javascript
import UniversalEmbed from "universal-embed/custom"
import WordPressPage from "universal-embed/pages/wordpress"
import JoomlaPage from "universal-embed/pages/joomla"

UniversalEmbed.pages = [
  WordPressPage,
  JoomlaPage
]

const universalEmbed = new UniversalEmbed()

universalEmbed.show()
```

#### Style

If the `theme` configuration option is too coarse, the modal stylesheet can be altered or replaced.

```javascript
import UniversalEmbed from "universal-embed"

UniversalEmbed.modalStylesheet += `
  header {
    font-weight: bold
  }
`
```

## Usage

#### Constructor - `new UniversalEmbed(options)`,

Accepts options config.

- `theme`: Object.

```javascript
const universalEmbed = new UniversalEmbed({
  theme: {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  }
})
```

- `downloadURLs`: Object of strings

```javascript
const universalEmbed = new UniversalEmbed({
  downloadURLs: {
    wordpress: "http://example.com/wordpress-plugin.zip",
    joomla: "http://example.com/joomla-plugin.zip"
  }
})
```

#### `UniversalEmbed#show` - Show modal

#### `UniversalEmbed#hide` - Hide modal

#### `UniversalEmbed#destroy` - Destroy modal

## Contributing

```shell
npm install
npm start
```

Then navigate to http://localhost:9000
