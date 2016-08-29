import drupal7 from "./drupal-7"
import drupal8 from "./drupal-8"

import BaseTarget from "components/base-target"

export default class DrupalTarget extends BaseTarget {
  static id = "drupal";
  static label = "Drupal";
  static supports = {embedCode: true, plugin: true};
  static versions = [
    drupal8,
    drupal7
  ];
}
