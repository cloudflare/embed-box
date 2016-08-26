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
import wordpress4 from "./wordpress-4.pug"

import BaseTarget from "components/base-target"

export default class WordPressTarget extends BaseTarget {
  static id = "wordpress";
  static label = "WordPress";
  static policy = "NAND";
  static versions = [{id: "4.x", template: wordpress4}];
}
```

The [Pug](https://github.com/EagerIO/EmbedBox/blob/master/app/components/targets/wordpress/wordpress.pug) file is a template.
Templates are compiled to a function during the build process (more on this later).

Every target extends `BaseTarget` to inherit common helper methods.
The `static` attributes are metadata that inform EmbedBox about the target.
Unlike the usual project style, `static` attributes require a semicolon after each declaration.

- `id` is a unique, dashes-between-words identifier.
- `policy` is the used to determine whether the target can render given the [EmbedBox's options](http://embedbox.io/#targets).
- `label` is the human readable identifier.
- `versions` is an array of objects for each supported version.

## Creation

Now that we have an idea of what makes a target, let's create our own with a target called FooBar.
A target's label guides the `id`, let's use `foobar`.
Create a new directory named after the `id`.
In the directory, create template for each version in the format of `id-version.pug`

```shell
mkdir app/components/targets/foobar
touch app/components/targets/foobar/index.js
touch app/components/targets/foobar/foobar-1-2-3.pug
touch app/components/targets/foobar/foobar-4-5-6.pug
```

```javascript
import foobar1_2_3 from "./foobar-1-2-3.pug"
import foobar4_5_6 from "./foobar-4-5-6.pug"

import BaseTarget from "components/base-target"

export default class FoobarTarget extends BaseTarget {
  static id = "foobar";
  static label = "FooBar";
  static template = template;
  static versions = [
    {id: "1.2.3", template: foobar1_2_3},
    {id: "4.5.6", template: foobar4_5_6}
  ];
}
```

If everything looks great visually, then you're ready to submit a PR!

Happy hacking!
