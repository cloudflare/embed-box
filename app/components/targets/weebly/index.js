import template from "./weebly.pug"

import BaseTarget from "components/base-target"

export default class WeeblyTarget extends BaseTarget {
  static id = "weebly";
  static label = "Weebly";
  static policy = "NAND";
  static template = template;
}
