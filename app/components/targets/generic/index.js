import template from "./generic.pug"

import BaseTarget from "components/base-target"

export default class GenericTarget extends BaseTarget {
  static id = "generic";
  static label = "Any other site";
  static template = template;

  get downloadLabel() {
    return "Download the plugin"
  }

  static isConstructable(config, store) {
    const hasLocalEmbedCode = !!config.embedCode
    const hasGlobalEmbedCode = !!store.embedCode
    const hasDownloadURL = !!config.downloadURL

    // A `downloadURL` must be accompanied by an `embedCode`
    return hasDownloadURL && hasLocalEmbedCode || hasGlobalEmbedCode && !hasDownloadURL
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
