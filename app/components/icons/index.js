import BaseComponent from "components/base-component"

export const svgToComponent = template => {
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
export const close = svgToComponent(closeSVG)

import previousSVG from "./previous.svg"
export const previous = svgToComponent(previousSVG)

import nextSVG from "./next.svg"
export const next = svgToComponent(nextSVG)

import searchSVG from "./search.svg"
export const search = svgToComponent(searchSVG)

