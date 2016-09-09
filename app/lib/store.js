export function createStore(spec = {}) {
  const iframe = document.createElement("iframe")
  const {autoDownload = true, labels = {}} = spec

  return {
    name: spec.name || "a plugin",
    autoDownload,

    beforeContent: spec.beforeContent || "",
    afterContent: spec.afterContent || "",

    embedCode: spec.embedCode || "",

    fallbackID: typeof spec.fallbackID !== "undefined" ? spec.fallbackID : "generic",

    iframe: {
      element: iframe,
      get document() {
        return iframe.contentDocument
      },
      get window() {
        return iframe.contentWindow
      }
    },

    insertInHead: spec.insertInHead || false,

    labels: {
      searchHeader: "Select the type of website you have.",
      searchPlaceholder: "Search...",
      clickHint: "Click to view instructions",
      clickHintShort: "Click to view",
      submitHint: "Press ENTER to view instructions",
      submitHintShort: "Press ENTER",
      title: config => `Add ${config.name} to your site`,
      ...labels
    },

    routing: spec.routing || false,

    theme: {
      accentColor: "#2d88f3",
      backgroundColor: "#ffffff",
      screenshotAnnotationColor: "#fde757",
      stepNumberColor: "#2d88f3",
      textColor: "#000000",
      ...spec.theme
    }
  }
}
