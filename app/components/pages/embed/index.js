import template from "./embed.pug"

import BasePage from "components/page"

export default class EmbedPage extends BasePage {
  static fallback = true;
  static id = "embed";
  static label = "Another CMS";
  static template = template;
}
