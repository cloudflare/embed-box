# Embed Box

An open-source UI which makes it easy for your users to install your embed code.

## Installation

EmbedBox supports the latest Chrome, Safari Firefox, and IE9+

### Standalone

Download and include with a script tag.
`EmbedBox` will be registered as a global variable.

```html
<head>
  <script src="embed-box.js"></script>
</head>

<body>
  <script>
    new EmbedBox({
      appName: "Example App",
      downloadURLs: {
        wordpress: "http://example.com/wordpress-plugin.zip",
        joomla: "http://example.com/joomla-plugin.zip",
        drupal: "http://example.com/drupal-plugin.zip",
        generic: "http://example.com/generic-plugin.js"
      }
    })
  </script>
</body>
```

### NPM

NPM is the recommended install method when your application uses a build process.

```shell
$ npm install --save embed-box
```

```javascript
import EmbedBox from "embed-box"

const embedBox = new EmbedBox()

embedBox.show()
```

### Customization

#### Content

Page content can be customized by adding content in slots.

```javascript
import EmbedBox from "embed-box"

const embedBox = new EmbedBox({
  beforeContent: "Contact <strong>ACME Inc.</strong> for an account ID.",
  afterContent: "Thanks you for installing ACME Inc. embed!"
})
```

#### Custom Pages

```javascript
import EmbedBox from "embed-box"
import CustomPage from "embed-box/custom-page"

const CustomPage = EmbedBoxCustomPage.extend({
  id: "custom-test",
  label: "Custom Page",
  template: "<section>Hello from a custom page!</section>"
})

const embedBox = new EmbedBox({
  pages: [CustomPage]
})
```

Templates can be passed as function as well to pass varibles.
The EmbedBox configuration is available under `vars.config`.

```javascript
const CustomPage = EmbedBoxCustomPage.extend({
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
  <script src="embed-box-custom.js"></script>
  <script src="embed-box-page-wordpress.js"></script>
  <script src="embed-box-page-joomla.js"></script>
</head>

<body>
  <script>
    console.log(EmbedBox.fetchedPages) // [WordPressPage, JoomlaPage]

    const embedBox = new EmbedBoxCustom()

    embedBox.show()
  </script>
</body>
```

##### With builder

```javascript
import EmbedBoxCustom from "embed-box/custom"
import WordPressPage from "embed-box/pages/wordpress"
import JoomlaPage from "embed-box/pages/joomla"

const embedBox = new EmbedBoxCustom({
  pages: [
    WordPressPage,
    JoomlaPage
  ]
})
```

#### Style

If the `theme` configuration option is too coarse, the modal stylesheet can be altered or replaced.

```javascript
import EmbedBox from "embed-box"

EmbedBox.modalStylesheet += `
  header {
    font-weight: bold;
  }
`
```

## Usage

#### Constructor - `new EmbedBox(options)`,

- `theme`

```javascript
const embedBox = new EmbedBox({
  theme: {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  }
})
```

- `downloadURLs`

```javascript
const embedBox = new EmbedBox({
  downloadURLs: {
    wordpress: "http://example.com/wordpress-plugin.zip",
    joomla: "http://example.com/joomla-plugin.zip"
  }
})
```

- `autoDownload`: defaults to `true`

- `autoShow`: defaults to `true`

#### `EmbedBox#show` - Show modal

#### `EmbedBox#hide` - Hide modal

#### `EmbedBox#destroy` - Destroy modal

## Contributing

```shell
npm install
npm start
```

Then navigate to http://localhost:9000
