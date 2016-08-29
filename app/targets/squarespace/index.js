import squarespaceLatest from "./squarespace-latest"
import icon from "./squarespace.svg"

import BaseTarget from "components/base-target"

export default class SquarespaceTarget extends BaseTarget {
  static icon = icon;
  static id = "squarespace";
  static label = "Squarespace";
  static supports = {embedCode: true};
  static versions = [squarespaceLatest];
}
