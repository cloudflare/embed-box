import weeblyLatest from "./weebly-latest.pug"
import icon from "./weebly.svg"

import BaseTarget from "components/base-target"

export default class WeeblyTarget extends BaseTarget {
  static icon = icon;
  static id = "weebly";
  static label = "Weebly";
  static supports = {embedCode: true, insertInto: {head: true, body: true}};
  static versions = [{id: "Latest", template: weeblyLatest}];
}
