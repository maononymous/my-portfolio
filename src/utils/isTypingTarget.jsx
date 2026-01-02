// utils/isTypingTarget.js
export function isTypingTarget(el) {
  if (!el) return false
  const tag = el.tagName?.toLowerCase()
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    el.isContentEditable
  )
}
