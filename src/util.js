export const findKey = (obj, path, dflt = null) => {
  let key
  let _obj = obj
  let parts = path.split('.')
  while (parts.length && (key = parts.shift())) {
    if (!(key in _obj)) {
      return dflt
    }
    _obj = _obj[key]
  }
  return _obj
}

export const bindEvent = (context, event, action) => {
  return new Promise((resolve, reject) => {
    context.detectors.once(event, (...args) => {
      if (typeof action === 'string') {
        resolve(findKey(context, action, () => {})
          .apply(context, [event].concat(args)))
      } else if (typeof action === 'function') {
        resolve(action(event, ...args))
      } else {
        reject(new Error("Can't bind event"))
      }
    })
  })
}

export const bindEvents = (context, events) => {
  for (let event in events) {
    bindEvent(context, event, events[event].action)
  }
}
