import template from "./generic.pug"

import BaseTarget from "components/base-target"

export default class GenericTarget extends BaseTarget {
  static id = "generic";
  static label = "Any other site";
  static policy = "NAND";
  static template = template;

  get downloadLabel() {
    return "Download the plugin"
  }

  get modalTitle() {
    return this.title
  }

  get versions() {
    // TODO: Placeholder for real version logic.
    return []
  }

  get title() {
    return `Installing ${this.store.name}.`
  }
}
