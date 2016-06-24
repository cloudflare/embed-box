import "./spec.styl"

export const computed = {
  previousAvailable() {
    return false // TODO: flesh out
  }
}

export const el = "body"

export const data = {
  appName: "Drift Chat",
  backgroundColor: "white",
  accent: "black",
  types: [
    {label: "WordPress", id: "wordpress"},
    {label: "Drupal", id: "drupal"},
    {label: "Joomla", id: "joomla"},
    {label: "Embed", id: "embed"}
  ]
}

export const replace = false

export template from "./spec.pug"
