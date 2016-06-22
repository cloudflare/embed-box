import "./site-type-search.styl"

import React from "react"
import * as icons from "components/icons"

const TYPE_PATTERN = /\s/g

export default class SiteTypeSearch extends React.Component {
  state = {
    query: ""
  };

  _handleQueryInput({target: {value}}) {
    this.setState({query: value})
  }

  _renderVisibleTypes() {
    const {query} = this.state
    const pattern = new RegExp(query, "i")
    let {types} = this.props

    if (query) {
      types = types.filter(criteria => criteria.search(pattern) !== -1)
    }

    return types.map(type => {
      const normalizedType = type.toLowerCase().replace(TYPE_PATTERN, "-")

      return <div className="type" data-type={normalizedType} key={type}>
        {icons[normalizedType]}
        {type}
      </div>
    })
  }

  render() {
    const {query} = this.state

    return <section data-column data-component="containers/site-type-search">
      <div className="header">
        <input
          autoFocus
          className="search"
          onInput={this._handleQueryInput.bind(this)}
          placeholder="Select or search the type of website you have."
          type="text"
          value={query}
        />
      </div>

      <div className="types" data-column>
        {this._renderVisibleTypes()}
      </div>
    </section>
  }
}
