import template from "./drupal-7.pug"
import activateModule from "./activate-module"
import navigateToModules from "./navigate-to-modules"
import installNewModules from "./install-new-modules"
import uploadModule from "./upload-module"
import installationSuccessful from "./installation-successful"

export default {
  id: "7",
  template,
  screenshots: {
    activateModule,
    installationSuccessful,
    navigateToModules,
    installNewModules,
    uploadModule
  }
}
