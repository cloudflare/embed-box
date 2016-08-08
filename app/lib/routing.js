const ROUTE_PREFIX = "#!/embed/"

export function getRoute() {
  return window.location.hash.split(ROUTE_PREFIX)[1] || null
}

export function setRoute(route = "") {
  window.location.hash = ROUTE_PREFIX + route
}
