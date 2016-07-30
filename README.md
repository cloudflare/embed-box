# Embed Box

[![CircleCI](https://circleci.com/gh/EagerIO/EmbedBox/tree/master.svg?style=svg)](https://circleci.com/gh/EagerIO/EmbedBox/tree/master)

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
    var embedBox = new EmbedBox({
      name: "Example Plugin",
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

NPM is the recommended install method when your application uses a build process like Webpack or Browserify.

```shell
$ npm install --save embed-box
```

```javascript
import EmbedBox from "embed-box"

const embedBox = new EmbedBox()
```

### Customization

#### Content

Target content can be customized by adding content in slots.

```javascript
new EmbedBox({
  beforeContent: "Having some trouble? " +
    "Call us at <strong>(555)-123-4567</strong>",
  afterContent: "You should receive an email with your account password."
})
```

#### Custom targets

If the content slots are too coarse, custom targets can be created with the custom build.

Include the custom package for an empty EmbedBox.

```html
<script src="embed-box-custom.js"></script>
<script src="embed-box-custom-target.js"></script>
```

Or import them with a bundler.

```javascript
import EmbedBoxCustom from "embed-box/custom"
import CustomTarget from "embed-box/custom-target"
```

```javascript
var CustomTarget = EmbedBoxCustomTarget.extend({
  id: "custom-test",
  label: "Custom Target",
  template: "<section>Hello from a custom target!</section>"
})

new EmbedBoxCustom({
  targets: [CustomTarget]
})
```

Templates can be passed as function as well to pass varibles.
The EmbedBox configuration is available under `vars.config`.

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
    +   "<h1>Installing " + vars.config.name + "</h1>"
    +   "<p>"
    +     "<a href='${vars.registerURL}'>Register an account</a>"
    +     " before installing."
    +   "</p>"
    + "</section>"
  }
})

new EmbedBoxCustom({
  name: "Custom Target Example",
  targets: [CustomTarget]
})
})
```

#### Custom Bundles

A custom bundle can be made to include specific targets.

##### Standalone

```html
<head>
  <script src="embed-box-custom.js"></script>
  <script src="embed-box-target-wordpress.js"></script>
  <script src="embed-box-target-joomla.js"></script>
</head>

<body>
  <script>
    console.log(EmbedBox.fetchedTargets) // [WordPressTarget, JoomlaTarget]

    const embedBox = new EmbedBoxCustom()
  </script>
</body>
```

##### With bundler

```javascript
import EmbedBoxCustom from "embed-box/custom"
import WordPressTarget from "embed-box/targets/wordpress"
import JoomlaTarget from "embed-box/targets/joomla"

const embedBox = new EmbedBoxCustom({
  targets: [
    WordPressTarget,
    JoomlaTarget
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

Please do, we would love for this to become a project of the community.
Feel free to open an issue, submit a PR or contribute to the wiki.

### Development

```shell
npm install
npm start
```

Then navigate to <a href="http://localhost:9000" target="_blank">http://localhost:9000</a>
