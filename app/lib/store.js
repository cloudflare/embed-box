export function initializeStore(instance, spec = {}) {
  const iframe = document.createElement("iframe")
  const {autoDownload = true, labels = {}} = spec

  window.EmbedBoxStore = {
    appName: spec.appName || "an app",
    instance,

    autoDownload,

    beforeContent: spec.beforeContent || "",
    afterContent: spec.afterContent || "",

    downloadURLs: spec.downloadURLs || {},

    iframe: {
      element: iframe,
      get document() {
        return iframe.contentDocument
      },
      get window() {
        return iframe.contentWindow
      }
    },

    labels: {
      done: "Done",
      searchPlaceholder: "Select or search the type of website you have...",
      next: "Next",
      title: appName => `Add ${appName} to your site`,
      ...labels
    }
  }

  return window.EmbedBoxStore
}

export function getStore() {
  return window.EmbedBoxStore
}

export function destroyStore() {
  delete window.EmbedBoxStore
}
