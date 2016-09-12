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

EmbedBox separates targets into [individual directories](https://github.com/EagerIO/EmbedBox/tree/master/app/targets).
It's a great idea to take a look at some of those existing targets to get an idea of how the folders are structured.

As you can see, each target is composed of a few types of files:
- The [Pug](https://github.com/EagerIO/EmbedBox/blob/master/app/targets/wordpress/wordpress-4.pug) file is a template.
- The JS file defines the metadata about the target and allows you to fancy JS customization should you need.
- The images are used in the template, and are automatically compiled into the final JS files.

### JavaScript

The `index.js` file for every target specifies how it's composed.
Let's take a look at the WordPress target:

```javascript
import wordpress4 from "./wordpress-4.pug"
import icon from "./wordpress.svg"

import BaseTarget from "components/base-target"

export default class WordPressTarget extends BaseTarget {
  static icon = icon;
  static id = "wordpress";
  static label = "WordPress";
  static supports = {embedCode: true, plugin: true};
  static versions = [{id: "4.x", template: wordpress4}];
}
```

You'll notice this is [ES6](https://github.com/lukehoban/es6features),
the modern variant of JavaScript which will be automatically compiled into more
browser-compatible JS by the build tool.

Every target extends `BaseTarget` to inherit common helper methods.
The `static` attributes are metadata that inform EmbedBox about the target.
Unlike the usual project style, `static` attributes require a semicolon after each declaration.

Here are the options which may be specified:

#### `icon`

A logo in the format of an SVG string. You can import this logo as in the WordPress example,
and use the build system to grab the string from an SVG file.
Running your SVG file through [SVG Optimizer](https://jakearchibald.github.io/svgomg/)
can reduce the file size signifigantly.

#### `id`

A unique, dashes-between-words identifier.

#### `supports`

An object which defines what types of installations this target can handle. It's of the form:

```javascript
{embedCode: true, plugin: true}
```

An embed code installation is where the EmbedBox user has provided an HTML embed code
which the docs should instruct the user how to install.
A plugin installation is where the EmbedBox user has provided a plugin which the user should install into their CMS.
If you support both, it's necessary to have the template handle both eventualities.
If you only support plugin-based installs your target won't be shown if the EmbedBox
user doesn't have the appropriate plugin.

### `label`

The human readable title

### `versions`

Allows you to specify multiple versions of this target.
This is important if your CMS has more than one significant version which users may need to install onto,
and if the instructions vary considerabily based on which version they're using.

If you only have one version, specify it:

```javascript
[{id: "4.x", template: wordpress4}]
```

If you have multiple versions,specify each with it's own options as in the
[Drupal target](https://github.com/EagerIO/EmbedBox/blob/master/app/targets/drupal/index.js).

### HTML

The Pug (formerly Jade) template file is used to define the HTML which will be used to build the documentation.
In general your template needs to handle a couple 'forks' depending on the configuration the plugin creator has specified:

#### Plugin vs No Plugin

If your platform supports plugins (like WordPress),
it's a good idea to handle both the case where the user has a plugin they would like installed,
and the case where they don't have a plugin and the user should see generic embed code installation instructions.

Unfortunately on many platforms the generic instructions are somewhat complex,
involving steps like finding the right template and finding the appropriate place in the HTML to install the code.
This is unavoidable sadly, all we can do is our best.

#### Head vs Body

The service using EmbedBox may need to be installed in the `<head>`, or in the `<body>` of the page.
This is only applicable if the service does not have a plugin on this platform,
and is instead using the generic embed code instructions.

## Creation

To create your own target, begin by copying an existing target folder which is similar to yours.
Change the `id` and other properties in the `.js` file.
Then the landing page (using the URL provided when you ran `npm start`),
and write the instructions for your platform into the `.pug` file.

If everything looks great in your browser, then you're ready to submit a PR!

Happy hacking!
