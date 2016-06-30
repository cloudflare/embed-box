export default {
  appName: "Drift Chat",
  siteId: "Icc0-PIkXF",

  selectedId: "",
  page: "home",

  types: [
    {label: "WordPress", id: "wordpress"},
    {label: "Drupal", id: "drupal"},
    {label: "Joomla", id: "joomla"},
    {label: "Embed", id: "embed"}
  ],

  accentColor: "#2d88f3",
  textColor: "#000000",
  backgroundColor: "#ffffff",

  labels: {
    done: "Done",
    searchPlaceholder: "Select or search the type of website you have...",
    next: "Next",
    title: appName => `Add ${appName} to your site`
  }
}
