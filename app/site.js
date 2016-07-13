import stylesheet from "./site.styl"
import UniversalEmbed from "../universal-embed.js"
import UniversalEmbedCustomPage from "../custom-page.js"

const style = document.createElement("style")

style.innerHTML = stylesheet
document.head.appendChild(style)

const examples = {
  basic() {
    const universalEmbed = new UniversalEmbed()

    universalEmbed.show()
  }
}

function handleRunClick(event) {
  const element = event.target

  const key = element.getAttribute("data-example")

  examples[key]()
}
document.addEventListener("DOMContentLoaded", () => {
  // TODO polyfill me!
  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))


  const CustomPage = UniversalEmbedCustomPage.extend({
    id: "custom-test",
    label: "Custom Page",
    templateVars: {
      registerURL: "http://example.com/register"
    },
    template: vars => `<section>
      <h1>Installing ${vars.config.appName} from a custom page</h1>

      <p>
        <a href="${vars.registerURL}">Register an account</a> before installing.
      </p>
    </section>`
  })

  UniversalEmbed.pages.push(CustomPage)

  // const universalEmbed = new UniversalEmbed()

  // universalEmbed.show()
})
