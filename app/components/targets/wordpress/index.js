import template from "./wordpress.pug"

import BaseTarget from "components/base-target"

export default class WordpressTarget extends BaseTarget {
  static fallback = false;
  static id = "wordpress";
  static label = "WordPress";
  static template = template;
}
