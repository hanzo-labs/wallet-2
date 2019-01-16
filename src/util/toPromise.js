import Promise from 'broken'

export default var toPromise = (fn) => {
  return () => {
    let args = arguments
    return new Promise((resolve, reject) {
      try {
        resolve(fn.apply(null, args))
      } catch (e) {
        reject(e)
      }
    }
  }
}
