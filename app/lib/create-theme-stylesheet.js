export default function createThemeStylesheet(theme) {
  const _ = value => `${value || "inherit"} !important;`

  return `
    [data-component="application"] .modal {
      background-color: ${_(theme.backgroundColor)}
      color: ${_(theme.textColor)}
    }

    a, .accent-color {
      color: ${_(theme.accentColor)}
    }

    .button.primary, button.primary,
    [data-component="target-search"] .entries .entry[data-selected],
    [data-component="target-search"] .entries .entry:active,
    [data-component="application"][is-touch-device="true"] [data-component="target-search"] .entries .entry:hover,
    .accent-background-color {
      background: ${_(theme.accentColor)}
    }

    .target-instructions .steps li:before {
      background: ${_(theme.accentColor)}
    }
  `
}
