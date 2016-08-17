import template from "./activate-plugin.pug"
import stylesheet from "./activate-plugin.styl"

import BaseScreenshot from "components/base-screenshot"

export default class Screenshot extends BaseScreenshot {
  static template = template;
  static stylesheet = stylesheet;
}
