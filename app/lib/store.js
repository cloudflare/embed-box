export function initializeStore(instance, spec = {}) {
  const iframe = document.createElement("iframe")
  const {autoDownload = true, labels = {}} = spec

  window.EmbedBoxStore = {
    name: spec.name || "a plugin",
    instance,

    autoDownload,

    beforeContent: spec.beforeContent || "",
    afterContent: spec.afterContent || "",

    downloadURL: spec.downloadURL || "",

    embedCode: spec.embedCode || "",

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
      title: config => `Add ${config.name} to your site`,
      ...labels
    },

    insertInHead: spec.insertInHead || false
  }

  return window.EmbedBoxStore
}

export function getStore(parent = window) {
  return parent.EmbedBoxStore
}

export function destroyStore(parent = window) {
  delete parent.EmbedBoxStore
}
