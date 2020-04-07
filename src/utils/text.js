export function plural (text) {
  return typeof text === 'string' ? (text.endsWith('s') ? text : text + 's') : text
}
