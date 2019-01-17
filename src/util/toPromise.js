let toPromise = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(fn.apply(null, args))
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default toPromise
