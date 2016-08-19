import template from "./activate-module.pug"
import stylesheet from "./activate-module.styl"

import BaseScreenshot from "components/base-screenshot"

export default class Screenshot extends BaseScreenshot {
  static template = template;
  static stylesheet = stylesheet;
}
