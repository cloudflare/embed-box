export default function isElementPartiallyInViewport(element) {
  const {left, top, height, width} = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  const inViewVertically = top <= windowHeight && top + height >= 0
  const inViewHorizontally = left <= windowWidth && left + width >= 0

  return inViewVertically && inViewHorizontally
}
