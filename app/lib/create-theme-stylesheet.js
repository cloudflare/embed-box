import createStylesheetTemplate from "lib/create-stylesheet-template"

export default function createThemeStylesheet(theme) {
  const stylesheetTemplate = createStylesheetTemplate(theme)

  return stylesheetTemplate`
    [data-component="application"] .surface {
      background-color: ${"backgroundColor"}
      color: ${"textColor"}
    }

    .surface a, .accent-color {
      color: ${"accentColor"}
    }

    .button.primary, button.primary,
    [data-component="target-search"] .entries .entry[data-selected],
    [data-component="target-search"] .entries .entry:active,
    [data-component="application"][is-touch-device="true"] [data-component="target-search"] .entries .entry:hover,
    .accent-background-color {
      background: ${"accentColor"}
    }

    .target-instructions .steps li::before {
      background: ${"stepNumberColor"}
    }

    .target-instructions figure [annotation-arrow] svg {
      fill: ${"screenshotAnnotationColor"}
    }
  `
}
