let store = null

export function initializeStore(instance, spec = {}) {
  const iframe = document.createElement("iframe")
  const {appName = "an app", beforeContent = "", afterContent = "", downloadURLs = {}, labels = {}} = spec

  store = {
    appName,
    instance,

    beforeContent,
    afterContent,

    downloadURLs,

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

  return store
}

export function getStore() {
  return store
}

