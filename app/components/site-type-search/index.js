import "./site-type-search.styl"


export const computed = {
  visibleTypes() {
    let {types} = this

    if (this.query) {
      const pattern = new RegExp(this.query, "i")

      types = types.filter(({label}) => label.search(pattern) !== -1)

      // TODO: get feedback on this approach.
      if (!types.length) types.push({label: "Embed", id: "embed"})
    }

    return types
  }
}

export function data() {
  return {
    selected: "",
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
