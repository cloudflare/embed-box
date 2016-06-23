import toDashCase from "lib/to-dash-case"
import * as siteTypeSearch from "./site-type-search"
import * as icons from "./icons"

const components = {...icons,
  siteTypeSearch
}

export function install(Vue) {
  Object.keys(components).forEach(key => {
    Vue.component(toDashCase(key), components[key])
  })
}
