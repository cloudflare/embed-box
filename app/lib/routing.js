const ROUTE_PREFIX = "#!/embed/"

export function getRoute() {
  return window.location.hash.split(ROUTE_PREFIX)[1] || null
}

export function setRoute(route = "") {
  const {pathname} = window.location

  if (route === "" && window.history.pushState && pathname !== "srcdoc") {
    window.history.pushState("", "", pathname)

    return
  }

  window.location.hash = ROUTE_PREFIX + route
}
