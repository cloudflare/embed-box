import BaseComponent from "components/base-component"

const toComponent = template => {
  return class Icon extends BaseComponent {
    static template = template;

    constructor(attributes = {}) {
      super()

      this.attributes = {class: "icon", ...attributes}
    }

    render() {
      const element = this.compileTemplate()

      Object
        .keys(this.attributes)
        .forEach(key => element.setAttribute(key, this.attributes[key]))

      return element
    }
  }
}

import closeSVG from "./close.svg"
export const close = toComponent(closeSVG)

import drupalSVG from "./drupal.svg"
export const drupal = toComponent(drupalSVG)

import genericSVG from "./generic.svg"
export const generic = toComponent(genericSVG)

import joomlaSVG from "./joomla.svg"
export const joomla = toComponent(joomlaSVG)

import previousSVG from "./previous.svg"
export const previous = toComponent(previousSVG)

import searchSVG from "./search.svg"
export const search = toComponent(searchSVG)

import weeblySVG from "./weebly.svg"
export const weebly = toComponent(weeblySVG)

import wordpressSVG from "./wordpress.svg"
export const wordpress = toComponent(wordpressSVG)
