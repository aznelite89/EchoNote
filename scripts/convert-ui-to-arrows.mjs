/**
 * Converts statement-start `function Name(...)` / `export function Name(...)`
 * to `const Name = (...) =>` / `export const Name = (...) =>`.
 * Skips nested callbacks (e.g. `.map(function (`).
 */
import fs from "node:fs"
import path from "node:path"

const uiDir = path.join(process.cwd(), "components/ui")

function findMatchingParen(s, openIdx) {
  let depth = 0
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i]
    if (c === "(") depth++
    else if (c === ")") {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function skipWs(s, i) {
  while (i < s.length && /\s/.test(s[i])) i++
  return i
}

function isLineStart(content, i) {
  if (i === 0) return true
  return content[i - 1] === "\n"
}

/** If previous non-empty line ends with `(`, this `function` is likely a callback (e.g. after `.map(`). */
function prevLineEndsWithOpenParen(content, idx) {
  let e = idx - 1
  while (e >= 0 && content[e] !== "\n") e--
  if (e < 0) return false
  let s = e - 1
  while (s >= 0 && content[s] !== "\n") s--
  const line = content.slice(s + 1, e + 1).trimEnd()
  return line.endsWith("(")
}

function convertFile(content) {
  let out = ""
  let i = 0

  while (i < content.length) {
    if (!isLineStart(content, i)) {
      out += content[i]
      i++
      continue
    }

    let k = skipWs(content, i)
    const rest = content.slice(k)
    const exportM = rest.match(/^export\s+function\s+/)
    const plainM = !exportM && rest.match(/^function\s+/)
    const m = exportM || plainM
    if (!m) {
      out += content[i]
      i++
      continue
    }

    if (plainM && prevLineEndsWithOpenParen(content, k)) {
      out += content[i]
      i++
      continue
    }

    const isExport = !!exportM
    let pos = k + m[0].length

    const nameMatch = content.slice(pos).match(/^([A-Za-z_$][\w$]*)/)
    if (!nameMatch) {
      out += content[i]
      i++
      continue
    }
    const name = nameMatch[1]
    pos += name.length

    pos = skipWs(content, pos)
    if (content[pos] !== "(") {
      out += content[i]
      i++
      continue
    }

    const closeParen = findMatchingParen(content, pos)
    if (closeParen < 0) {
      out += content[i]
      i++
      continue
    }

    let j = skipWs(content, closeParen + 1)
    if (content[j] !== "{") {
      out += content[i]
      i++
      continue
    }

    const head = isExport ? `export const ${name} = ` : `const ${name} = `
    out += content.slice(i, k) + head + content.slice(pos, closeParen + 1) + " => "
    i = j
  }

  return out
}

const entries = fs.readdirSync(uiDir)
for (const name of entries) {
  if (!name.endsWith(".tsx") && !name.endsWith(".ts")) continue
  const p = path.join(uiDir, name)
  const raw = fs.readFileSync(p, "utf8")
  const next = convertFile(raw)
  if (next !== raw) fs.writeFileSync(p, next)
}

console.log("Done converting components/ui to arrow const form.")
