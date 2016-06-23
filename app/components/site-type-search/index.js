import "./site-type-search.styl"

const TYPE_PATTERN = /\s/g
const normalizeLabel = type => type.toLowerCase().replace(TYPE_PATTERN, "-")

export const computed = {
  visibleTypes() {
    let {types} = this

    if (this.query) {
      const pattern = new RegExp(this.query, "i")

      types = types.filter(criteria => criteria.search(pattern) !== -1)
    }

    return types.map(label => ({label, id: normalizeLabel(label)}))
  }
}

export function data() {
  return {
    query: ""
  }
}

export const props = {
  types: {
    required: true,
    type: Array
  }
}

export template from "./site-type-search.pug"
