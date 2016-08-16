import drupal7Template from "./drupal-7.pug"
import drupal8Template from "./drupal-8.pug"

import BaseTarget from "components/base-target"

export default class DrupalTarget extends BaseTarget {
  static id = "drupal";
  static label = "Drupal";
  static policy = "EMBED";
  static versions = [
    {id: "8", template: drupal8Template},
    {id: "7", template: drupal7Template}
  ];
}
