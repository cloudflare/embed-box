import BasePage from "components/page"

const toComponent = ({fallback = false, id, label, template}) => {
  return class VendorPage extends BasePage {
    static fallback = fallback;
    static id = id;
    static label = label;
    static template = template;
  }
}

import drupalTemplate from "./drupal/drupal.pug"
export const drupal = toComponent({
  label: "Drupal",
  id: "drupal",
  template: drupalTemplate
})

import embedTemplate from "./embed/embed.pug"
export const embed = toComponent({
  fallback: true,
  label: "Another CMS",
  id: "embed",
  template: embedTemplate
})

import joomlaTemplate from "./joomla/joomla.pug"
export const joomla = toComponent({
  label: "Joomla",
  id: "joomla",
  template: joomlaTemplate
})

import wordpressTemplate from "./wordpress/wordpress.pug"
export const wordpress = toComponent({
  label: "WordPress",
  id: "wordpress",
  template: wordpressTemplate
})

