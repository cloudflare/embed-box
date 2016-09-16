# EmbedBox

[![CircleCI](https://circleci.com/gh/EagerIO/EmbedBox/tree/master.svg?style=svg)](https://circleci.com/gh/EagerIO/EmbedBox/tree/master)
[![npm version](https://badge.fury.io/js/embed-box.svg)](https://badge.fury.io/js/embed-box)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/EagerIO/EmbedBox/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

EmbedBox is an open-source UI you can simply drop in to provide instructions for installing your embed code or plugins on every major CMS.

[Learn how to use EmbedBox in your own project](http://embedbox.io/).

## Contributing

We would love for this to become a project of the community.
Feel free to open an issue, submit a PR or contribute to the docs.

### Adding instructions for more CMS platforms

EmbedBox currently has instructions for all of the most popular CMS platforms, including WordPress, Weebly, Joomla, and Drupal, and we plan to continue to add more over time.

We’re planning to add more targets over time. You can track our progress in [Project #1](https://github.com/EagerIO/EmbedBox/projects/1). The more CMS instructions we can add, the more useful and powerful EmbedBox will become. Follow [these guidelines](https://github.com/EagerIO/EmbedBox/blob/master/docs/new-targets.md) when contributing docs for new “targets” (what the EmbedBox codebase calls CMS platforms).

### Requirements
Node v5.0.0+

### Development

```shell
npm install
npm start
```

Then navigate to <a href="http://localhost:9000" target="_blank">http://localhost:9000</a>

For a breakdown of how EmbedBox is built, check out our [design architecture](https://github.com/EagerIO/EmbedBox/blob/master/docs/design-architecture.md) docs.

### Testing

```shell
cd ./test
npm install
npm test
```

Then navigate to <a href="http://localhost:9001" target="_blank">http://localhost:9001</a>

#### Releases

EmbedBox uses [semantic versioning](http://semver.org/)

```shell
npm run release 1.2.3
git push && git push --tags && npm publish
```

## Companies using EmbedBox

- [Eager](https://eager.io)
- [Rakam](https://rakam.io/integrate?part=website)

Let us know if you’d like your product be added to this list!

