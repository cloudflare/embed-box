import "./application.styl"

import React from "react"
import SiteTypeSearch from "containers/site-type-search"

export default class Application extends React.Component {
  state = {
    appName: "Drift Chat",
    types: [
      "WordPress",
      "Drupal",
      "Joomla",
      "Embed"
    ]
  };

  render() {
    const {appName, types} = this.state

    return <section data-column data-component="containers/application">
      <div className="modal" data-column>
        <div className="header">
          <button data-action="previous">PP</button>

          <span>Add {appName} to your site</span>

          <button data-action="close">CC</button>
        </div>

        <SiteTypeSearch types={types} />

      </div>
    </section>
  }
}
