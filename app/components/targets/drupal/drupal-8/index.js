import template from "./drupal-8.pug"
import navigateToModules from "./navigate-to-modules"
import installNewModules from "./install-new-modules"
import uploadModule from "./upload-module"
import activateModule from "./activate-module"

export default {
  id: "8",
  template,
  screenshots: {
    activateModule,
    navigateToModules,
    installNewModules,
    uploadModule
  }
}
