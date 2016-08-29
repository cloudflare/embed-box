import template from "./installation-successful.pug"
import stylesheet from "./installation-successful.styl"

import BaseScreenshot from "components/base-screenshot"

export default class Screenshot extends BaseScreenshot {
  static template = template;
  static stylesheet = stylesheet;
}
