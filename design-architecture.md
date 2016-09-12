# Design Architecture

The internal design of EmbedBox focuses on two goals in particular.

1. Ease of extension.
2. File size.

The first is sought using components. The second is sought using our build system.

EmbedBox components are similar to React components, but without the virtual DOM.
Almost every UI component inherits methods from the `BaseComponent` class and mounts itself in a similar fashion.

`BaseComponent` contains a collection of common component concerns.

## Component Lifecycle

## Authoring
Components usually exist in their own directory along with their internal dependencies
such as stylesheets, images, and templates.

When creating a component the common features are:

## `component-name.styl`
This file holds your component specific styles.
The following elements are set to flex positioning by the inherited styles.

```styl
div, footer, header, main, section
  display flex

[data-flow="column"]
  flex-flow column nowrap
```

All styles should be namespaced to prevent undesired CSS inheritance.

```styl
[data-component="target-search"]
  .title
    color blue

  .details
     font-size .9em
```
## `component-name.pug`
A Pug template for the static portion of the HTML.

Rather than clutter the component logic with `element.querySelector(".foo-bar")` multiple times,
Components templates can add the `data-ref="fooBar"` attribute to an element.

```pug
section(data-flow="column" data-component="target-search" data-event-receiver)
  header.header(data-flow="column")
    label(for="search-input")= label("searchHeader")
    .input-wrapper(data-ref="inputWrapper")
      input#search-input.search(
        data-ref="search"
        placeholder=label("searchPlaceholder")
        spellcheck="false"
        tabindex="3"
        type="text")
      .search-clear(
        data-ref="searchClear"
        tabindex="3")

  .entries(data-flow="column" data-ref="entriesContainer")

```

The component instance can then reference the element with `this.refs.fooBar`.
Append `[]` to a `data-ref` if the ref should be an array, (e.g. `data-ref="items[]`)


## `index.js`
This is the heart of your component where the dependencies are imported and assigned to the class declaration.
The WebPack build system will convert the template and stylesheet into resources the browser can interpret.
The `BaseComponent` class does provides most of the common utilities such as inserting stylesheets or compiling templates.

```javascript
import template from "./target-search.pug"
import stylesheet from "./target-search.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"

export default class TargetSearch extends BaseComponent {
  static template = template;
  static stylesheet = stylesheet;

  query = ""; // Instance property.

  @autobind // Decorator to use consistent `this` on event handlers.
  handleSearchInput() {
    const {search} = this.refs

    this.query = search.value.toLowerCase()
  }

  render() {
    this.compileTemplate() // Implemented in BaseComponent.

    // Refs declared in template.
    const {inputWrapper, search, searchClear} = this.refs

    search.addEventListener("input", this.handleSearchInput)

    return this.element // Returning the element is expected.
  }
}
```
