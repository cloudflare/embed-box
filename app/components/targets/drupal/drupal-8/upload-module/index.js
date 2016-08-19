import template from "./upload-modules.pug"
import stylesheet from "./upload-modules.styl"

import BaseScreenshot from "components/base-screenshot"

export default class Screenshot extends BaseScreenshot {
  static template = template;
  static stylesheet = stylesheet;
}
