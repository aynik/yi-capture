export const append = (type) => {
  const el = document.createElement(type)
  document.body.appendChild(el)
  return el
}

export const remove = (el) => {
  return document.body.removeChild(el)
}

export const findAll = (selector) => {
  return [].slice.call(document.querySelectorAll(selector))
}

export const listen = (el, name, listener) => {
  el.addEventListener(name, listener, false)
  return listener
}

export const unlisten = (el, name, listener) => {
  return el.removeEventListener(name, listener)
}
