let store = null

export function initializeStore(instance) {
  const iframe = document.createElement("iframe")

  store = {
    appName: "Drift Chat",
    siteId: "Icc0-PIkXF",

    instance,

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
      title: appName => `Add ${appName} to your site`
    }
  }

  return store
}

export function getStore() {
  return store
}

