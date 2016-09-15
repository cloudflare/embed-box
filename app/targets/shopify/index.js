import shopifyLatest from "./shopify-latest"
import icon from "./shopify.svg"

import BaseTarget from "components/base-target"

export default class ShopifyTarget extends BaseTarget {
  static icon = icon;
  static id = "shopify";
  static label = "Shopify";
  static supports = {embedCode: true, insertInto: {head: true, body: true}};
  static versions = [shopifyLatest];
}
