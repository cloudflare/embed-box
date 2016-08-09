import template from "./weebly.pug"

import BaseTarget from "components/base-target"

export default class WeeblyTarget extends BaseTarget {
  static fallback = false;
  static id = "weebly";
  static label = "Weebly";
  static template = template;
}
