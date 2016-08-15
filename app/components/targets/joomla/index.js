import template from "./joomla.pug"

import BaseTarget from "components/base-target"

export default class JoomlaTarget extends BaseTarget {
  static id = "joomla";
  static label = "Joomla";
  static template = template;
}
