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
  const bindOnce = (action, ...args) => {
    return new Promise((resolve, reject) => {
      if (typeof action === 'object') {
        const col = []
        for (let n in action) {
          col.push(bindOnce(action[n], ...args))
        }
        Promise.all(col).then(resolve).catch(reject)
      } else if (typeof action === 'string') {
        findKey(context, action, () => (
          Promise.reject(new Error("Can't find action: " + action))
        )).apply(context, [event].concat(args))
          .then(resolve).catch(reject)
      } else if (typeof action === 'function') {
        action(event, ...args).then(resolve).catch(reject)
      } else {
        reject(new Error("Can't bind event"))
      }
    })
  }
  return new Promise((resolve, reject) => {
    context.detectors.once(event, (...args) => (
      bindOnce(action, ...args).then(resolve).catch(reject)
    ))
  })
}

export const bindEvents = (context, events) => {
  for (let event in events) {
    bindEvent(context, event, events[event].action)
  }
}
