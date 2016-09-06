const ROUTE_PREFIX = "#!/embed/"

export function getRoute() {
  return window.location.hash.split(ROUTE_PREFIX)[1] || null
}

export function setRoute(route = "") {
  if (route === "" && window.history.pushState) {
    window.history.pushState("", "", window.location.pathname)

    return
  }

  window.location.hash = ROUTE_PREFIX + route
}
