import stylesheet from "./pages.styl"

import BaseComponent from "components/base-component"

let mountedSharedStyle = false

const toComponent = template => {
  return class Page extends BaseComponent {
    static template = template;

    constructor() {
      super()

      const {document: iframeDocument} = this.store.iframe

      if (!mountedSharedStyle) {
        const style = iframeDocument.createElement("style")

        style.innerHTML = stylesheet

        iframeDocument.head.appendChild(style)

        mountedSharedStyle = true
      }
    }
  }
}

import drupalTemplate from "./drupal/drupal.pug"
export const drupal = toComponent(drupalTemplate)

import embedTemplate from "./embed/embed.pug"
export const embed = toComponent(embedTemplate)

import joomlaTemplate from "./joomla/joomla.pug"
export const joomla = toComponent(joomlaTemplate)

import wordpressTemplate from "./wordpress/wordpress.pug"
export const wordpress = toComponent(wordpressTemplate)

