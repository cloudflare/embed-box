import joomla3_6_x from "./joomla-3-6-x.pug"

import BaseTarget from "components/base-target"

export default class JoomlaTarget extends BaseTarget {
  static id = "joomla";
  static label = "Joomla";
  static supports = {embedCode: true, plugin: true};
  static versions = [{id: "3.6.x", template: joomla3_6_x}];
}
