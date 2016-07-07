# Universal Embed

Give your users a way to embed your plugin onto any type of website.

## Installation

The universal embed supports the latest Chrome, Safari Firefox, and IE9+

### Standalone

Download and include with a script tag.
`EagerUniversalEmbed` will be registered as a global variable.

```html
<head>
  <script src="eager-universal-embed.js"></script>
</head>

<body>
  <script>
    const universalEmbed = new EagerUniversalEmbed()

    universalEmbed.show()
  </script>
</body>
```

### NPM

NPM is the recommended install method when your application uses a build process.

```shell
$ npm install --save eager-universal-embed
```

```javascript
import EagerUniversalEmbed from "eager-universal-embed"

const universalEmbed = new EagerUniversalEmbed()

universalEmbed.show()
```

### Customization

Page content can be customized by adding content in slots.

```javascript
import EagerUniversalEmbed from "eager-universal-embed"

EagerUniversalEmbed.beforeContent = "Contact ACME Inc. for an account ID."
EagerUniversalEmbed.afterContent = "Thanks you for installing ACME Inc. embed!"

const universalEmbed = new EagerUniversalEmbed()

universalEmbed.show()
```

Slot content can be limited to single pages as well.

```javascript
const wordPressPage = EagerUniversalEmbed.getPage("wordpress")

wordPressPage.beforeContent = "ACME recommends WordPress 4.5 or higher"
```

A custom bundle can be made to include specific pages.

### Standalone

```html
<head>
  <script src="eager-universal-embed-bare.js"></script>
  <script src="eager-universal-embed-page-wordpress.js"></script>
  <script src="eager-universal-embed-page-joomla.js"></script>
</head>

<body>
  <script>
    console.log(EagerUniversalEmbed.pages) // [EagerWordPressPage, EagerJoomlaPage]

    const universalEmbed = new EagerUniversalEmbed()

    universalEmbed.show()
  </script>
</body>
```

#### With builder

```javascript
import EagerUniversalEmbed from "eager-universal-embed/bare"
import WordPressPage from "eager-universal-embed/pages/wordpress"
import JoomlaPage from "eager-universal-embed/pages/joomla"

EagerUniversalEmbed.pages = [
  WordPressPage,
  JoomlaPage
]

const universalEmbed = new EagerUniversalEmbed()

universalEmbed.show()
```

## Usage

### Constructor - `new EagerUniversalEmbed(options)`,

Accepts options config.

- `container`: element or string passed to querySelector.

```javascript
const universalEmbed = new EagerUniversalEmbed({
  container: document.body // Default
})
```

```javascript
const universalEmbed = new EagerUniversalEmbed({
  container: "#wrapper"
})
```

### `EagerUniversalEmbed#show`

Show modal

### `EagerUniversalEmbed#hide`

Hide modal

### `EagerUniversalEmbed#destroy`

Destroy modal

## Contributing

```shell
npm install
npm start
```

Then navigate to http://localhost:9000
