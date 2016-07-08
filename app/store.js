const iframe = document.createElement("iframe")

export default {
  appName: "Drift Chat",
  siteId: "Icc0-PIkXF",

  selectedId: "",
  page: "home",

  iframe: {
    element: iframe,
    get document() {
      return iframe.contentDocument
    },
    get window() {
      return iframe.contentWindow
    }
  },

  types: [],

  labels: {
    done: "Done",
    searchPlaceholder: "Select or search the type of website you have...",
    next: "Next",
    title: appName => `Add ${appName} to your site`
  }
}
