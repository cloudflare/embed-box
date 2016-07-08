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

UniversalEmbed.beforeContent = "Contact ACME Inc. for an account ID."
UniversalEmbed.afterContent = "Thanks you for installing ACME Inc. embed!"

const universalEmbed = new UniversalEmbed()

universalEmbed.show()
```

Slot content can be limited to single pages as well.

```javascript
const wordPressPage = UniversalEmbed.getPage("wordpress")

wordPressPage.beforeContent = "ACME recommends WordPress 4.5 or higher"
```

A custom bundle can be made to include specific pages.

##### Standalone

```html
<head>
  <script src="universal-embed-bare.js"></script>
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
import UniversalEmbed from "universal-embed/bare"
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

- `container`: element or string passed to querySelector.

```javascript
const universalEmbed = new UniversalEmbed({
  container: document.body // Default
})
```

```javascript
const universalEmbed = new UniversalEmbed({
  container: "#wrapper"
})
```

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

#### `UniversalEmbed#show` - Show modal

#### `UniversalEmbed#hide` - Hide modal

#### `UniversalEmbed#destroy` - Destroy modal

## Contributing

```shell
npm install
npm start
```

Then navigate to http://localhost:9000
