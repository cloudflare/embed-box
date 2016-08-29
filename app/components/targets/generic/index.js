import genericLatest from "./generic-latest"

import BaseTarget from "components/base-target"

export default class GenericTarget extends BaseTarget {
  static id = "generic";
  static label = "Any other site";
  static supports = {embedCode: true};
  static versions = [genericLatest];

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
