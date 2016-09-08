import EmbedBox from "embed-box"

document.addEventListener("DOMContentLoaded", () => {
  new EmbedBox({
    name: "Example Plugin",
    embedCode: "<script src='http://embedbox.io/examples/library.js'></script>"
  })
})
