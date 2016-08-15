import template from "./wordpress.pug"

import BaseTarget from "components/base-target"

export default class WordPressTarget extends BaseTarget {
  static id = "wordpress";
  static label = "WordPress";
  static template = template;
}
