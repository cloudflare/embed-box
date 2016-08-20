import wordpress4 from "./wordpress-4.pug"

import BaseTarget from "components/base-target"

export default class WordPressTarget extends BaseTarget {
  static id = "wordpress";
  static label = "WordPress";
  static policy = "NAND";
  static versions = [{id: "4.x", template: wordpress4}];
}
