import tumblrLatest from "./tumblr-latest"
import icon from "./tumblr.svg"

import BaseTarget from "components/base-target"

export default class TumblrTarget extends BaseTarget {
  static icon = icon;
  static id = "tumblr";
  static label = "Tumblr";
  static supports = {embedCode: true, insertInto: {head: true, body: true}};
  static versions = [tumblrLatest];
}
