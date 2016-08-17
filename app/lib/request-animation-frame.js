export default function polyfillRequestAnimationFrame(window) {
  let lastTime = 0

  window.requestAnimationFrame = window.msRequestAnimationFrame
  window.cancelAnimationFrame = window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall)

      lastTime = currTime + timeToCall

      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = clearTimeout
  }
}
