import genericLatest from "./generic-latest"

import BaseTarget from "components/base-target"

export default class GenericTarget extends BaseTarget {
  static id = "generic";
  static label = "Any other site";
  static supports = {embedCode: true};
  static versions = [genericLatest];

  get headerTitle() {
    return this.title
  }

  get title() {
    return `Installing ${this.store.name}.`
  }
}
