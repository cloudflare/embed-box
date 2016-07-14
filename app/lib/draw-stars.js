const randomInt = max => parseInt(Math.random() * max, 10)
const randomOpacity = () => (randomInt(9) * 0.1).toPrecision(2)

const xmlns = "http://www.w3.org/2000/svg"

let animationFrame
let timeout

export default function drawStars(svg) {
  clearTimeout(timeout)
  cancelAnimationFrame(animationFrame)

  const stars = []
  const {clientWidth, clientHeight} = svg.parentNode

  svg.innerHTML = ""
  svg.removeAttribute("data-rendered")
  svg.setAttribute("width", clientWidth)
  svg.setAttribute("height", clientHeight)

  for (let i = 0; i < 400; i++) {
    const star = document.createElementNS(xmlns, "circle")
    const lightness = 80 + randomInt(30)
    const hue = randomInt(360)

    const attrs = {
      class: "star",
      cx: randomInt(clientWidth),
      cy: randomInt(clientHeight),
      fill: `hsl(${hue}, 100%, ${lightness}%)`,
      opacity: randomOpacity(),
      r: (randomInt(20) * 0.1).toPrecision(2)
    }

    Object.keys(attrs).forEach(key => star.setAttribute(key, attrs[key]))

    stars.push(star)
    svg.appendChild(star)
  }

  function render() {
    stars.forEach(star => {
      if (Math.random() * 10 > 6) return

      star.setAttribute("opacity", randomOpacity())
    })

    timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(render)
    }, 600)
  }

  render()
  svg.setAttribute("data-rendered", "")
}
