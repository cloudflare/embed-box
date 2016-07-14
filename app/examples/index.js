import UniversalEmbed from "../universal-embed.js"
import UniversalEmbedCustomPage from "../custom-page.js"

export function basic() {
  const universalEmbed = new UniversalEmbed()

  universalEmbed.show()
}

export function custom() {
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

  const universalEmbed = new UniversalEmbed()

  universalEmbed.show()
}
