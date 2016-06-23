const PATTERN = /([a-z])([A-Z])/g

export default function toDashCase(string = "") {
  return string.replace(PATTERN, "$1-$2").toLowerCase()
}
