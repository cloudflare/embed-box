import template from "./generic.pug"

import BaseTarget from "components/base-target"

export default class GenericTarget extends BaseTarget {
  static fallback = true;
  static id = "generic";
  static label = "Any other site";
  static template = template;

  get downloadLabel() {
    return "Download the plugin"
  }
}
