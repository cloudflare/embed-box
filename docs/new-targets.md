# Contributing new targets

Is there new target you'd like to see in the EmbedBox? Let's dive in!

## Setup

Start by cloning the repo to your machine and installing the dependencies.
Version 5 or higher of Node is recommended.

```shell
git clone git@github.com:EagerIO/EmbedBox.git
cd EmbedBox
npm install
npm start
```

Your terminal will be running a local development server.
Open the URL logged to to the terminal in your browser and you'll see the EmbedBox landing page.

## Overview

EmbedBox separates targets into [individual directories](https://github.com/EagerIO/EmbedBox/tree/master/app/components/targets).
The `index.js` file for every target specifies how it's composed.
Let's take a look at the WordPress target.

```javascript
import template from "./wordpress.pug"

import BaseTarget from "components/base-target"

export default class WordPressTarget extends BaseTarget {
  static fallback = false;
  static id = "wordpress";
  static label = "WordPress";
  static template = template;
}
```

The [Pug](https://github.com/EagerIO/EmbedBox/blob/master/app/components/targets/wordpress/wordpress.pug) file is a template.
Templates are compiled to a function during the build process (more on this later).

Every target extends `BaseTarget` to inherit common helper methods.
The `static` attributes are metadata that inform EmbedBox about the target.

- `fallback` refers to whether the target should always appear when the user searches for an unknown target. This more likely to be used for the "Generic" target.
- `id` is a unique, dashes-between-words identifier.
- `label` is the human readable identifier.
- `template` is an template function common among all instances of the target.

## Creation

Now that we have an idea of what makes a target, let's create our own with a target called FooBar.
Create a new directory named after the `id`. In the directory, create template with the same `id`, and a `index.js` file.

```javascript
import template from "./foobar.pug"

import BaseTarget from "components/base-target"

export default class FoobarTarget extends BaseTarget {
  static fallback = false;
  static id = "foobar";
  static label = "Foobar";
  static template = template;
}
```

This should look pretty familiar. Fleshing out the `foobar.pug` template is easier by consulting an existing similar target. The steps usually follow a pattern.

- A title.
- The "before content" block.
- Instructions if using a downloadable plugin.
- Instructions if using an embed code, and its location.
- The "after content" block.

Once you've filled out your template, expose the target in the [targets/index.js](https://github.com/EagerIO/EmbedBox/blob/master/app/components/targets/index.js) file.

The `EmbedBoxCustom` flavor lets developers put together a specific collection of targets. We can add our new target by creating a [module builder file](https://github.com/EagerIO/EmbedBox/blob/master/modules/targets/wordpress.js)

Lastly, create [module definition](https://github.com/EagerIO/EmbedBox/blob/master/targets/wordpress.js). This will allow Node.js users to do something like...

```javascript
import EmbedBoxCustom from "embed-box/custom"
import WordPressTarget from "embed-box/targets/wordpress"

EmbedBoxCustom.fetchedTargets.push(WordPressTarget)
```

These are a bit redundant at the moment and may generated in the future.

If everything looks great, then you're ready to submit a PR!

Happy hacking!
