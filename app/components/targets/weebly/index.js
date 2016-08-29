import weeblyLatest from "./weebly-latest.pug"

import BaseTarget from "components/base-target"

export default class WeeblyTarget extends BaseTarget {
  static id = "weebly";
  static label = "Weebly";
  static policy = "NAND";
  static supports = {embedCode: true};
  static versions = [{id: "Latest", template: weeblyLatest}];
}
