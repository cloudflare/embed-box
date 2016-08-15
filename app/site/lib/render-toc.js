import createSticky from "stickyfill"

export default function renderTOC() {
  const sticky = createSticky()
  const toc = document.querySelector(".table-of-contents")
  const docsNav = document.querySelector(".docs-nav > .sticky")
  const demoWrapper = document.querySelector(".demo-wrapper > .sticky")

  Array
    .from(document.querySelectorAll("h2.headline-with-anchor [name], h3.headline-with-anchor [name]"))
    .forEach(({parentNode, href, textContent}) => {
      const ul = parentNode.tagName === "H3" ? toc.lastChild.lastChild : toc
      const li = document.createElement("li")
      const a = document.createElement("a")

      Object.assign(a, {href, textContent})

      li.appendChild(a)
      ul.appendChild(li)

      if (parentNode.tagName === "H2") {
        const nextUl = document.createElement("ul")

        li.appendChild(nextUl)
      }
    })

  sticky.add(docsNav)
  sticky.add(demoWrapper)
}
