import template from "./drupal-7.pug"
import activatePlugin from "./activate-plugin"
import navigateToModules from "./navigate-to-modules"
import installNewModules from "./install-new-modules"
import uploadModule from "./upload-module"

export default {
  id: "7",
  template,
  screenshots: {activatePlugin, navigateToModules, installNewModules, uploadModule}
}
