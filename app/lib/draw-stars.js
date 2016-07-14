function randomInt(max) {
  return parseInt(Math.random() * max, 10)
}

export default function drawStars(canvas) {
  const ctx = canvas.getContext("2d")
  const angle = 2 * Math.PI
  const {clientWidth, clientHeight} = canvas.parentNode

  canvas.removeAttribute("data-rendered")
  canvas.setAttribute("width", clientWidth)
  canvas.setAttribute("height", clientHeight)

  for (let i = 0; i < 400; i++) {
    const x = randomInt(clientWidth)
    const y = randomInt(clientHeight)

    ctx.fillStyle = `hsla(${randomInt(360)}, 100%, ${80 + randomInt(30)}%, ${randomInt(9) * 0.1})`
    ctx.beginPath()
    ctx.arc(x, y, randomInt(20) * 0.1, 0, angle)
    ctx.fill()
  }

  canvas.setAttribute("data-rendered", "")
}
